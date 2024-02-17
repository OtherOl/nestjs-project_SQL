import { Injectable } from '@nestjs/common';
import { securityViewModel } from '../../base/types/security.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async deleteAllSessions(deviceId: string): Promise<any> {
    return await this.dataSource.query(
      `
        DELETE FROM public."Sessions"
        WHERE "deviceId" != $1
    `,
      [deviceId],
    );
  }

  async createSession(newSession: securityViewModel) {
    return await this.dataSource.query(
      `
        INSERT INTO public."Sessions"(
            id, ip, title, "lastActiveDate", "deviceId", "userId")
            VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [
        newSession.id,
        newSession.ip,
        newSession.title,
        newSession.lastActiveDate,
        newSession.deviceId,
        newSession.userId,
      ],
    );
  }

  async updateSession(deviceId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Sessions"
            SET "lastActiveDate"= $1
            WHERE "deviceId" = $2;
    `,
      [new Date().toISOString(), deviceId],
    );
  }

  async deleteSpecifiedSession(deviceId: string) {
    return await this.dataSource.query(
      `
          DELETE FROM public."Sessions"
          WHERE "deviceId" = $1
    `,
      [deviceId],
    );
  }
}
