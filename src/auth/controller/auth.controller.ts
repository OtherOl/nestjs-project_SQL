import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ConfirmationCode, createUserModel, UserLogin } from '../../base/types/users.model';
import { UsersService } from '../../users/application/users.service';
import { AuthService } from '../application/auth.service';
import { Response } from 'express';
import { add } from 'date-fns/add';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('password-recovery')
  async passwordRecovery() {}

  @Post('new-password')
  async newPassword() {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() inputData: UserLogin, @Res() response: Response) {
    const user = await this.authService.checkCredentials(inputData);
    const token = await this.authService.createAccessToken(user.id);
    const refreshToken = await this.authService.createRefreshToken(user.id);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { seconds: 20 }),
    });
    return response.send({ accessToken: token });
  }

  @Post('refresh-token')
  async refreshToken() {}

  @Post('registration-confirmation')
  async registrationConfirmation(@Body() code: ConfirmationCode) {
    return await this.authService.confirmEmail(code);
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() inputData: createUserModel) {
    return await this.usersService.createUserForRegistration(inputData);
  }

  @Post('registration-email-resending')
  async registrationEmailResending() {}

  @Post('logout')
  async logout() {}

  @Get('me')
  async getProfile() {}
}
