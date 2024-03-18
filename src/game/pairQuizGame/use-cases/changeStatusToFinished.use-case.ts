import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';

@Injectable()
export class ChangeStatusToFinishedUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
  ) {}

  async changeToFinished(gameId: string) {
    const game = await this.pairQuizGameQueryRepository.getGameForMethod(gameId);
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(gameId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(gameId);
    if (
      firstPlayer!.answers.length === game!.questions.length &&
      secondPlayer!.answers.length === game!.questions.length
    ) {
      if (firstPlayer!.answerFinishDate < secondPlayer!.answerFinishDate) {
        await this.pairQuizGameRepository.addBonusFirstPlayer(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(game!.id);
      }
      if (secondPlayer!.answerFinishDate < firstPlayer!.answerFinishDate) {
        await this.pairQuizGameRepository.addBonusSecondPlayer(gameId);
        return await this.pairQuizGameRepository.changeGameStatusToFinished(game!.id);
      }
    }
  }
}
