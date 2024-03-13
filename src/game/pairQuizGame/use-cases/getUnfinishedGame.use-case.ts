import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';

@Injectable()
export class GetUnfinishedGameUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
  ) {}

  async getGame(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByUserId(userId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByUserId(userId);
    if (!firstPlayer && !secondPlayer) throw new NotFoundException('No active pair');
    if (firstPlayer) {
      return await this.pairQuizGameQueryRepository.getGameById(firstPlayer.gameId);
    } else if (secondPlayer) {
      return await this.pairQuizGameQueryRepository.getGameById(secondPlayer.gameId);
    }
  }
}
