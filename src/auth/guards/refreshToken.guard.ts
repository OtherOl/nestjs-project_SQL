import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthBlackListRepository } from '../repositories/auth-black-list-repository.service';
import { AuthWhiteListRepository } from '../repositories/auth-white_list.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthBlackListRepository,
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
// @Injectable()
// export class RefreshTokenGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private authWhiteListRepository: AuthWhiteListRepository,
//   ) {}
//   public async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req: Request = context.switchToHttp().getRequest();
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) throw new UnauthorizedException();
//
//     const token = req.cookies.refreshToken;
//     const isInvalid = await this.authWhiteListRepository.findInvalidToken(refreshToken);
//     if (isInvalid === null) throw new UnauthorizedException();
//
//     try {
//       await this.jwtService.verify(token);
//       return true;
//     } catch (error) {
//       throw new UnauthorizedException();
//     }
//   }
// }
