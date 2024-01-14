import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/application/auth.service';
import { securityViewModel } from '../../base/types/security.model';
import { ObjectId } from 'mongodb';
import { SecurityRepository } from '../repositories/security.repository';

@Injectable()
export class SecurityService {
  constructor(
    private authService: AuthService,
    private securityRepository: SecurityRepository,
  ) {}

  async createSession(ip: string, title: string = 'Chrome 105', refreshToken: string) {
    const verifiedToken = await this.authService.verifyToken(refreshToken);
    const newSession: securityViewModel = {
      id: new ObjectId(),
      ip: ip,
      title: title,
      lastActiveDate: new Date(verifiedToken.iat * 1000).toISOString(),
      deviceId: verifiedToken.deviceId,
      userId: verifiedToken.userId,
    };
    await this.securityRepository.createSession(newSession);
    return;
  }
}
