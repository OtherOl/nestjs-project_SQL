import { Controller } from '@nestjs/common';
import { SecurityQueryRepository } from '../repositories/security.query-repository';
import { SecurityRepository } from '../repositories/security.repository';

@Controller('security/devices')
export class SecurityController {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private securityRepository: SecurityRepository,
  ) {}

  async getAllSessions() {}
}
