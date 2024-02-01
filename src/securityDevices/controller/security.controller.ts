import { Controller, Delete, ForbiddenException, Get, HttpCode, Param, Req, UseGuards } from '@nestjs/common';
import { SecurityQueryRepository } from '../repositories/security.query-repository';
import { SecurityRepository } from '../repositories/security.repository';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { RefreshTokenGuard } from '../../auth/guards/refreshToken.guard';
import { GetDeviceIdUseCase } from '../../auth/use-cases/getDeviceId.use-case';
import { AuthWhiteListRepository } from '../../auth/repositories/auth-white_list.repository';

@Controller('security/devices')
export class SecurityController {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private securityRepository: SecurityRepository,
    private authService: AuthService,
    private authWhiteListRepository: AuthWhiteListRepository,
    private getDeviceIdUseCase: GetDeviceIdUseCase,
  ) {}

  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Get()
  @HttpCode(200)
  async getAllSessions(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const userId = await this.authService.getUserIdByToken(refreshToken);
    return await this.securityQueryRepository.getAllSessions(userId);
  }

  //удалить все кроме текущего refresh
  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(204)
  async deleteAllExceptOne(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const deviceId = await this.getDeviceIdUseCase.getDeviceId(refreshToken);
    await this.securityRepository.deleteAllSessions(deviceId);
    return;
  }

  //В теории создать новое entity для токенов в белом листе и потом искать там нужный по deviceId и удалять его
  @SkipThrottle()
  @Delete(':deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteSessionById(@Req() request: Request, @Param('deviceId') deviceId: string) {
    const refreshToken = request.cookies.refreshToken;
    const inputUserId = await this.authService.getUserIdByToken(refreshToken);
    const session = await this.securityQueryRepository.getSessionById(deviceId);
    if (inputUserId !== session.userId) throw new ForbiddenException();
    await this.securityRepository.deleteSpecifiedSession(deviceId);
    await this.authWhiteListRepository.deleteTokenByDeviceId(deviceId);
    return;
  }
}
