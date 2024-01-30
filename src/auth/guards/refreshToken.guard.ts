import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.cookies.refreshToken) throw new UnauthorizedException();

    const token = req.cookies.refreshToken;
    const isInvalid = await this.authRepository.findInvalidToken(token);
    if (isInvalid !== null) throw new UnauthorizedException();

    try {
      await this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
