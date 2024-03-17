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
    if (game!.firstPlayerProgress?.answers.length === game!.questions.length) {
      await this.pairQuizGameRepository.setFinishAnswerDateFirstPlayer(gameId);
    } else if (game!.secondPlayerProgress?.answers.length === game!.questions.length) {
      await this.pairQuizGameRepository.setFinishAnswerDateSecondPlayer(gameId);
    }
    if (
      game!.firstPlayerProgress?.answers.length === game!.questions.length &&
      game!.secondPlayerProgress?.answers.length === game!.questions.length
    ) {
      firstPlayer!.answerFinishDate < secondPlayer!.answerFinishDate
        ? await this.pairQuizGameRepository.addBonusFirstPlayer(gameId)
        : await this.pairQuizGameRepository.addBonusSecondPlayer(gameId);
      return await this.pairQuizGameRepository.changeGameStatusToFinished(game!.id);
    }
  }
}
