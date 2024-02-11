import { Injectable, NotFoundException } from '@nestjs/common';
import { securityViewModel } from '../../base/types/security.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllSessions(userId: string): Promise<securityViewModel[]> {
    return await this.dataSource.query(
      `
        SELECT ip, title, "lastActiveDate", "deviceId"
            FROM public."Sessions"
            WHERE "userId" = $1
    `,
      [userId],
    );
  }

  async getSessionById(deviceId: string) {
    const session = await this.dataSource.query(
      `
         SELECT *
         FROM public."Sessions"
         WHERE "deviceId" = $1
    `,
      [deviceId],
    );
    if (!session[0]) {
      throw new NotFoundException("Session doesn't exists");
    } else {
      return session[0];
    }
  }
}
