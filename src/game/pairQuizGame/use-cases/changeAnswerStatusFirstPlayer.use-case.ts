import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';

@Injectable()
export class ChangeAnswerStatusFirstPlayerUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
  ) {}

  async changeStatus(gameId: string) {
    const game = await this.pairQuizGameQueryRepository.getGameById(gameId);
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameId(gameId);
    if (firstPlayer!.answers.length === game!.questions!.length) {
      return await this.pairQuizGameRepository.setFinishAnswerDateFirstPlayer(gameId);
    } else {
      return;
    }
  }
}
