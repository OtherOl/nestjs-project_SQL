import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Security, SecurityDocument } from '../domain/security.entity';
import { Model } from 'mongoose';

@Injectable()
export class SecurityRepository {
  constructor(
    @InjectModel(Security.name) private securityModel: Model<SecurityDocument>,
  ) {}

  async deleteAllSessions(): Promise<any> {
    return this.securityModel.deleteMany({});
  }
}
