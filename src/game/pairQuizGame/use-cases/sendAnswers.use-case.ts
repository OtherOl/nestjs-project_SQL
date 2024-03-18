import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { FirstPlayerSendAnswerUseCase } from './firstPlayerSendAnswer.use-case';
import { SecondPlayerSendAnswerUseCase } from './secondPlayerSendAnswer.use-case';

@Injectable()
export class SendAnswersUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private firstPlayerSendAnswerUseCase: FirstPlayerSendAnswerUseCase,
    private secondPlayerSendAnswerUseCase: SecondPlayerSendAnswerUseCase,
  ) {}

  async sendAnswers(inputAnswer: string, accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getUnfinishedGame(userId);
    if (!game || (!game.firstPlayerProgress && !game.secondPlayerProgress))
      throw new ForbiddenException('No active pair');
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameIdAndUserId(
      game.id,
      userId,
    );
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameIdAndUserId(
      game.id,
      userId,
    );
    if (firstPlayer)
      return await this.firstPlayerSendAnswerUseCase.sendAnswer(
        firstPlayer,
        game.id,
        game.status,
        game.questions!,
        inputAnswer,
      );
    if (secondPlayer)
      return await this.secondPlayerSendAnswerUseCase.sendAnswer(
        secondPlayer,
        game.id,
        game.status,
        game.questions!,
        inputAnswer,
      );
  }
}
