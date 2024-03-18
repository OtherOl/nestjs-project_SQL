import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuestionsViewModel } from '../../../base/types/game.model';

@Injectable()
export class ChangeStatusToFinishedUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
  ) {}

  async changeToFinished(gameId: string, gameQuestions: QuestionsViewModel[]) {
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(gameId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(gameId);
    if (
      firstPlayer!.answers.length === gameQuestions.length &&
      secondPlayer!.answers.length === gameQuestions.length
    ) {
      if (firstPlayer!.answerFinishDate < secondPlayer!.answerFinishDate) {
        await this.pairQuizGameRepository.addBonusFirstPlayer(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(gameId);
      }
      if (secondPlayer!.answerFinishDate < firstPlayer!.answerFinishDate) {
        await this.pairQuizGameRepository.addBonusSecondPlayer(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(gameId);
      }
    }
  }
}
