import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthBlackListRepository } from './auth-black-list-repository.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthWhiteListRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private authBlackListRepository: AuthBlackListRepository,
  ) {}

  async createNewToken(token: string, userId: string, deviceId: string) {
    return await this.dataSource.query(
      `
        INSERT INTO public."AuthWhiteList"(
           token, "userId", "deviceId")
           VALUES ($1, $2, $3);
    `,
      [token, userId, deviceId],
    );
  }

  async deleteToken(token: string) {
    return await this.dataSource.query(
      `
          DELETE FROM public."AuthWhiteList"
             WHERE token = $1;
    `,
      [token],
    );
  }

  async deleteTokenByDeviceId(deviceId: string) {
    const refreshToken = await this.dataSource.query(
      `
        SELECT *
        FROM public."AuthWhiteList"
        WHERE "deviceId" = $1
    `,
      [deviceId],
    );
    await this.authBlackListRepository.blackList(refreshToken[0]!.token);
    return await this.dataSource.query(
      `
        DELETE FROM public."AuthWhiteList"
        WHERE "deviceId" = $1
    `,
      [deviceId],
    );
  }

  async deleteAllExceptOne(userId: string, deviceId: string) {
    return await this.dataSource.query(
      `
        DELETE FROM public."AuthWhiteList"
        WHERE "userId" = $1
        AND "deviceId" != $2
    `,
      [userId, deviceId],
    );
  }

  async findTokens(userId: ObjectId, deviceId: string): Promise<any | null> {
    return await this.dataSource.query(
      `
          SELECT *
          FROM public."AuthWhiteList"
          WHERE "userId" = $1
          AND "deviceId" != $2
    `,
      [userId, deviceId],
    );
  }
}
