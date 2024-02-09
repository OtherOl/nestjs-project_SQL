import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthBlackListRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async blackList(token: string) {
    return await this.dataSource.query(
      `
        INSERT INTO public."AuthBlackList"(
            token)
            VALUES ($1);
    `,
      [token],
    );
  }

  async findInvalidToken(token: string) {
    return await this.dataSource.query(
      `
        SELECT *
        FROM public."AuthBlackList"
        WHERE token = $1
    `,
      [token],
    );
  }
}
