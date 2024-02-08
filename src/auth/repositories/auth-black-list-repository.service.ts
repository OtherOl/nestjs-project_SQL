import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthBlackList, AuthBlackListDocument } from '../domain/auth-black_list.entity';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthBlackListRepository {
  constructor(
    @InjectModel(AuthBlackList.name) private authBlackListModel: Model<AuthBlackListDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

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
    return this.authBlackListModel.findOne({ token: token });
  }
}
