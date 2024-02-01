import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/application/auth.service';
import { AuthWhiteListRepository } from '../../auth/repositories/auth-white_list.repository';
import { AuthBlackListRepository } from '../../auth/repositories/auth-black-list-repository.service';

@Injectable()
export class DeleteTokensExceptOneUseCase {
  constructor(
    private authService: AuthService,
    private authWhileListRepository: AuthWhiteListRepository,
    private authBlackListRepository: AuthBlackListRepository,
  ) {}

  async deleteAllTokens(refreshToken: string) {
    const decodedToken = await this.authService.decodeRefreshToken(refreshToken);
    const tokens = await this.authWhileListRepository.findTokens(decodedToken.userId, decodedToken.deviceId);
    for (let i = 0; i < tokens.length; i++) {
      await this.authBlackListRepository.blackList(tokens[i].token);
    }
    await this.authWhileListRepository.deleteAllExceptOne(decodedToken.userId, decodedToken.deviceId);
    return;
  }
}
