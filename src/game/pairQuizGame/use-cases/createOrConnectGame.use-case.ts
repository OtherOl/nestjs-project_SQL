import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/auth.service';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { UsersQueryRepository } from '../../../users/repositories/users.query-repository';
import { JoinOrCreateGameForMainUseCase } from './joinOrCreateGameForMain.use-case';

@Injectable()
export class CreateOrConnectGameUseCase {
  constructor(
    private authService: AuthService,
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private joinOrCreateGameForMainUseCase: JoinOrCreateGameForMainUseCase,
  ) {}

  async createOrConnect(accessToken: string) {
    const userId = await this.authService.getUserIdByToken(accessToken.split(' ')[1]);
    const user = await this.usersQueryRepository.getUserById(userId);
    const firstPlayer = await this.pairQuizGameQueryRepository.getFirstPlayerByUserId(userId);
    const secondPlayer = await this.pairQuizGameQueryRepository.getSecondPlayerByUserId(userId);
    if (firstPlayer) {
      const game = await this.pairQuizGameQueryRepository.getGameById(firstPlayer.gameId);
      if (game!.status !== 'Finished') {
        throw new ForbiddenException('user is already participating in active pair');
      } else if (game!.status === 'Finished') {
        return await this.joinOrCreateGameForMainUseCase.joinOrCreateGame(userId, user!);
      }
    } else if (secondPlayer) {
      const game = await this.pairQuizGameQueryRepository.getGameById(secondPlayer.gameId);
      if (game!.status !== 'Finished') {
        throw new ForbiddenException('user is already participating in active pair');
      } else if (game!.status === 'Finished') {
        return await this.joinOrCreateGameForMainUseCase.joinOrCreateGame(userId, user!);
      }
    }
    if (!firstPlayer && !secondPlayer) {
      return await this.joinOrCreateGameForMainUseCase.joinOrCreateGame(userId, user!);
    }
  }
}
