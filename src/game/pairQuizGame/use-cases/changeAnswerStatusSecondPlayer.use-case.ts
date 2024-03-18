import { Injectable } from '@nestjs/common';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';

@Injectable()
export class ChangeAnswerStatusSecondPlayerUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
  ) {}

  async changeStatus(gameId: string) {
    const game = await this.pairQuizGameQueryRepository.getGameById(gameId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameId(gameId);
    if (secondPlayer!.answers.length === game!.questions!.length) {
      return await this.pairQuizGameRepository.setFinishAnswerDateSecondPlayer(gameId);
    } else {
      return;
    }
  }
}
