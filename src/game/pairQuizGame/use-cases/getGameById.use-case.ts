import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';

@Injectable()
export class GetGameByIdUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
  ) {}

  async getGame(accessToken: string, gameId: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const game = await this.pairQuizGameQueryRepository.getGameById(gameId);
    if (!game) throw new NotFoundException('Game not found');
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByGameIdAndUserId(
      gameId,
      userId,
    );
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByGameIdAndUserId(
      gameId,
      userId,
    );
    if (!firstPlayer && !secondPlayer) throw new ForbiddenException('You are not a participant in this game');
    if (firstPlayer || secondPlayer) return game;
  }
}
