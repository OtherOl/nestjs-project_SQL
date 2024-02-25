import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Security } from '../domain/security.entity';

@Injectable()
export class SecurityQueryRepository {
  constructor(@InjectRepository(Security) private securityRepository: Repository<Security>) {}

  async getAllSessions(userId: string): Promise<Security[]> {
    return await this.securityRepository
      .createQueryBuilder()
      .select(['ip', 'title', 'lastActiveDate', 'deviceId'])
      .where('userId = :userId', { userId })
      .getMany();
  }

  async getSessionById(deviceId: string) {
    const session = await this.securityRepository.findOneBy({ deviceId });
    if (!session) {
      throw new NotFoundException("Session doesn't exists");
    } else {
      return session;
    }
  }
}
