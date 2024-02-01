import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthBlackList, AuthBlackListDocument } from '../domain/auth-black_list.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthBlackListRepository {
  constructor(@InjectModel(AuthBlackList.name) private authBlackListModel: Model<AuthBlackListDocument>) {}

  async blackList(token: string) {
    return await this.authBlackListModel.create({ token });
  }

  async findInvalidToken(token: string) {
    return this.authBlackListModel.findOne({ token: token });
  }
}
