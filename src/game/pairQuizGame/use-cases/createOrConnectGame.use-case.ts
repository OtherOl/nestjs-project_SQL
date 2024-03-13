import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { UsersQueryRepository } from '../../../users/repositories/users.query-repository';
import { GameStatus, QuestionsViewModel } from '../../../base/types/game.model';
import { PairQuizGame } from '../domain/pairQuizGame.entity';
import { FirstPlayerProgress } from '../domain/firstPlayerProgress.entity';
import { SecondPlayerProgress } from '../domain/secondPlayerProgress.entity';
import { QuizQuestions } from '../../quizQuestions/domain/quizQuestions.entity';
import { QuizQuestionsRepository } from '../../quizQuestions/repositories/quizQuestions.repository';

@Injectable()
export class CreateOrConnectGameUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
    private usersQueryRepository: UsersQueryRepository,
    private quizQuestionsRepository: QuizQuestionsRepository,
  ) {}

  async createOrConnect(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const user = await this.usersQueryRepository.getUserById(userId);
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByUserId(userId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByUserId(userId);
    if (firstPlayer) {
      const game = await this.pairQuizGameQueryRepository.getGameById(firstPlayer.gameId);
      if (game!.status === 'Active')
        throw new ForbiddenException('user is already participating in active pair');
      return game;
    } else if (secondPlayer) {
      const game = await this.pairQuizGameQueryRepository.getGameById(secondPlayer.gameId);
      if (game!.status === 'Active')
        throw new ForbiddenException('user is already participating in active pair');
      return game;
    }
    if (!firstPlayer && !secondPlayer) {
      const game = await this.pairQuizGameQueryRepository.getGameByStatus(GameStatus.PendingSecondPlayer);
      if (!game) {
        const questions: QuestionsViewModel[] = [];
        for (let i = 0; i < 5; i++) {
          const newQuestion = QuizQuestions.createQuestion({
            body: `Solve the follow problem => 1 + ${i} = ?`,
            correctAnswers: [`${i + 1}`, 'some number'],
          });
          questions.push({ id: newQuestion.id, body: newQuestion.body });
          await this.quizQuestionsRepository.createQuestion(newQuestion);
        }
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
}
