import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/application/auth.service';
import { AuthWhiteListRepository } from '../../auth/repositories/auth-white_list.repository';

@Injectable()
export class DeleteTokensExceptOneUseCase {
  constructor(
    private authService: AuthService,
    private authWhileListRepository: AuthWhiteListRepository,
  ) {}

  async deleteAllTokens(refreshToken: string) {
    const decodedToken = await this.authService.decodeRefreshToken(refreshToken);
    await this.authWhileListRepository.deleteAllExceptOne(decodedToken.userId, decodedToken.deviceId);
    return;
  }
}
