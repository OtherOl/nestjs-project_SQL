import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Security, SecurityDocument } from '../domain/security.entity';
import { Model } from 'mongoose';
import { securityViewModel } from '../../base/types/security.model';

@Injectable()
export class SecurityRepository {
  constructor(@InjectModel(Security.name) private securityModel: Model<SecurityDocument>) {}

  async deleteAllSessions(deviceId: string): Promise<any> {
    return this.securityModel.deleteMany({ deviceId: { $ne: deviceId } });
  }

  async createSession(newSession: securityViewModel) {
    return await this.securityModel.create(newSession);
  }

  async updateSession(deviceId: string) {
    const updatedSession = await this.securityModel.updateOne(
      { deviceId: deviceId },
      { $set: { lastActivateDate: new Date().toISOString() } },
    );
    return updatedSession.modifiedCount === 1;
  }

  async deleteSpecifiedSession(deviceId: string) {
    const deletedSession = await this.securityModel.deleteOne({ deviceId });
    return deletedSession.deletedCount === 1;
  }
}
