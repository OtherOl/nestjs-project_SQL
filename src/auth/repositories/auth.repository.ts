import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from '../domain/auth.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>) {}

  async blackList(token: string) {
    await this.authModel.create(token);
  }

  async findInvalidToken(token: string) {
    return this.authModel.findOne({ token: token });
  }
}
