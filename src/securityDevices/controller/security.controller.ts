import { Controller, Delete, Get } from '@nestjs/common';
import { SecurityQueryRepository } from '../repositories/security.query-repository';
import { SecurityRepository } from '../repositories/security.repository';

@Controller('security/devices')
export class SecurityController {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private securityRepository: SecurityRepository,
  ) {}

  @Get()
  async getAllSessions() {
    return await this.securityQueryRepository.getAllSessions();
  }

  @Delete()
  async deleteAllExceptOne(): Promise<any> {
    return await this.securityRepository.deleteAllSessions();
  }

  @Delete(':deviceId')
  async deleteSessionById() {}
}
