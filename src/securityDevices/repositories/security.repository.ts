import { Injectable } from '@nestjs/common';
import { securityViewModel } from '../../base/types/security.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Security } from '../domain/security.entity';

@Injectable()
export class SecurityRepository {
  constructor(@InjectRepository(Security) private securityRepository: Repository<Security>) {}

  async deleteAllSessions(deviceId: string): Promise<any> {
    return await this.securityRepository
      .createQueryBuilder()
      .delete()
      .from(Security)
      .where('deviceId != :deviceId', { deviceId })
      .execute();
  }

  async createSession(newSession: securityViewModel) {
    return await this.securityRepository.insert(newSession);
  }

  async updateSession(deviceId: string) {
    return await this.securityRepository.update({ deviceId }, { lastActiveDate: new Date().toISOString() });
  }

  async deleteSpecifiedSession(deviceId: string) {
    return await this.securityRepository.delete({ deviceId });
  }
}
