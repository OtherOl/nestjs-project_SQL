import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/application/auth.service';
import { SecurityRepository } from '../repositories/security.repository';
import { securityViewModelSQL } from '../../base/types/security.model';
import { Security } from '../domain/security.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateSessionUseCase {
  constructor(
    private authService: AuthService,
    private securityRepository: SecurityRepository,
  ) {}

  async createSession(ip: string, title: string = 'Chrome 105', refreshToken: string) {
    const verifiedToken = await this.authService.verifyToken(refreshToken);
    const newSession: securityViewModelSQL = Security.createSession(ip, title, verifiedToken);
    const sessionId = uuidv4();
    await this.securityRepository.createSession(newSession, sessionId);
    return;
  }
}
