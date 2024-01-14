import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Security, SecurityDocument } from '../domain/security.entity';
import { Model } from 'mongoose';
import { securityViewModel } from '../../base/types/security.model';

@Injectable()
export class SecurityQueryRepository {
  constructor(@InjectModel(Security.name) private securityModel: Model<SecurityDocument>) {}

  async getAllSessions(): Promise<securityViewModel[]> {
    return this.securityModel.find({}, { _id: 0 });
  }
}
