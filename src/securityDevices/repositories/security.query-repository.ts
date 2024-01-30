import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Security, SecurityDocument } from '../domain/security.entity';
import { Model } from 'mongoose';
import { securityViewModel } from '../../base/types/security.model';

@Injectable()
export class SecurityQueryRepository {
  constructor(@InjectModel(Security.name) private securityModel: Model<SecurityDocument>) {}

  async getAllSessions(userId: string): Promise<securityViewModel[]> {
    return this.securityModel.find({ userId }, { _id: 0, id: 0, userId: 0 });
  }

  async getSessionById(deviceId: string) {
    const session = await this.securityModel.findOne({ deviceId });
    if (!session) {
      throw new NotFoundException("Session doesn't exists");
    } else {
      return session;
    }
  }
}
