import { Injectable } from '@nestjs/common';
import { GameStatus, QuestionsViewModel } from '../../../base/types/game.model';
import { PairQuizGame } from '../domain/pairQuizGame.entity';
import { FirstPlayerProgress } from '../domain/firstPlayerProgress.entity';
import { SecondPlayerProgress } from '../domain/secondPlayerProgress.entity';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { User } from '../../../users/domain/users.entity';
import { QuizQuestionsQueryRepository } from '../../quizQuestions/repositories/quizQuestions.query-repository';

@Injectable()
export class JoinOrCreateGameForMainUseCase {
  constructor(
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
  ) {}

  async joinOrCreateGame(userId: string, user: User) {
    const game = await this.pairQuizGameQueryRepository.getGameByStatus(GameStatus.PendingSecondPlayer);
    if (!game) {
      const questions: QuestionsViewModel[] = await this.quizQuestionsQueryRepository.getQuestionsForGame();
      const newGame = PairQuizGame.createGame(questions);
      const firstPlayer = FirstPlayerProgress.createFirstPlayer(userId, user!.login, newGame.id);
      await this.pairQuizGameRepository.createNewGame(newGame, {
        answers: firstPlayer.answers,
        player: firstPlayer.player,
        score: firstPlayer.score,
      });
      await this.pairQuizGameRepository.createFirstPlayer(firstPlayer);
      return await this.pairQuizGameQueryRepository.getGameById(newGame.id);
    } else {
      const secondPlayer = SecondPlayerProgress.createSecondPlayer(userId, user!.login, game.id);
      await this.pairQuizGameRepository.createSecondPlayer(secondPlayer);
      await this.pairQuizGameRepository.changeGameStatusToActive(game.id, {
        answers: secondPlayer.answers,
        player: secondPlayer.player,
        score: secondPlayer.score,
      });
      return await this.pairQuizGameQueryRepository.getGameById(game.id);
    }
  }
}
