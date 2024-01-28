import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/application/auth.service';
import { securityViewModel } from '../../base/types/security.model';
import { SecurityRepository } from '../repositories/security.repository';
import { Security } from '../domain/security.entity';

@Injectable()
export class SecurityService {
  constructor(
    private authService: AuthService,
    private securityRepository: SecurityRepository,
  ) {}

  async createSession(ip: string, title: string = 'Chrome 105', refreshToken: string) {
    const verifiedToken = await this.authService.verifyToken(refreshToken);
    const newSession: securityViewModel = Security.createSession(ip, title, verifiedToken);
    await this.securityRepository.createSession(newSession);
    return;
  }
}
