import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import {
  ConfirmationCode,
  createNewPassword,
  createUserModel,
  resendConfirmation,
  UserLogin,
} from '../../base/types/users.model';
import { UsersService } from '../../users/application/users.service';
import { AuthService } from '../application/auth.service';
import { Request, Response } from 'express';
import { add } from 'date-fns/add';
import { SecurityService } from '../../securityDevices/application/security.service';
import { AuthRepository } from '../repositories/auth.repository';
import { SecurityRepository } from '../../securityDevices/repositories/security.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private securityService: SecurityService,
    private securityRepository: SecurityRepository,
    private usersService: UsersService,
    private authService: AuthService,
    private authRepository: AuthRepository,
  ) {}

  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(@Body() email: resendConfirmation) {
    return await this.authService.passwordRecoveryCode(email);
  }

  @HttpCode(204)
  @Post('new-password')
  async newPassword(@Body() inputData: createNewPassword) {
    return await this.usersService.createNewPassword(inputData);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() inputData: UserLogin, @Res() response: Response, @Req() req: Request) {
    const user = await this.authService.checkCredentials(inputData);
    const token = await this.authService.createAccessToken(user.id);
    const refreshToken = await this.authService.createRefreshToken(user.id);
    await this.securityService.createSession(req.ip!, req.headers['user-agent'], refreshToken);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { seconds: 20 }),
    });
    return response.send({ accessToken: token });
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies.refreshToken();
    const verify = await this.authService.verifyToken(refreshToken);
    const userId = await this.authService.getUserIdByToken(refreshToken);
    await this.authRepository.blackList(refreshToken);

    const accessToken = await this.authService.createAccessToken(userId);
    const newRefreshToken = await this.authService.createRefreshToken(userId);

    const isInvalid = await this.authRepository.findInvalidToken(newRefreshToken);
    if (isInvalid) throw new UnauthorizedException();

    await this.securityRepository.updateSession(verify.deviceId);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { seconds: 20 }),
    });
    return response.send({ accessToken: accessToken });
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(@Body() code: ConfirmationCode) {
    return await this.authService.confirmEmail(code);
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() inputData: createUserModel) {
    await this.usersService.createUserForRegistration(inputData);
    return;
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() email: resendConfirmation) {
    return await this.authService.resendConfirmation(email);
  }

  @HttpCode(204)
  @Post('logout')
  async logout() {}

  @HttpCode(200)
  @Get('me')
  async getProfile() {
    // const user: userModel | undefined = req.user;
    // return {
    //   email: user!.email,
    //   login: user!.login,
    //   userId: user!.id,
    // };
  }
}