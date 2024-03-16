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
    if (
      game!.firstPlayerProgress?.answers.length === game!.questions.length &&
      game!.secondPlayerProgress?.answers.length === game!.questions.length
    ) {
      return await this.pairQuizGameRepository.changeGameStatusToFinished(game!.id);
    }
  }
}
