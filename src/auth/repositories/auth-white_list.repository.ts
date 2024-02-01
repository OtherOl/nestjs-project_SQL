import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthWhitelist, AuthWhiteListDocument } from '../domain/auth-white_list.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AuthBlackListRepository } from './auth-black-list-repository.service';

@Injectable()
export class AuthWhiteListRepository {
  constructor(
    @InjectModel(AuthWhitelist.name) private authWhiteListModel: Model<AuthWhiteListDocument>,
    private authBlackListRepository: AuthBlackListRepository,
  ) {}

  async createNewToken(token: string, userId: ObjectId, deviceId: string) {
    return this.authWhiteListModel.create({ token, userId, deviceId });
  }

  async deleteToken(token: string) {
    const deleted = await this.authWhiteListModel.deleteOne({ token });
    return deleted.deletedCount === 1;
  }

  async deleteTokenByDeviceId(deviceId: string) {
    // const refreshToken = await this.authWhiteListModel.findOne({ deviceId });
    // await this.authBlackListRepository.blackList(refreshToken!.token);
    const deletedToken = await this.authWhiteListModel.deleteOne({ deviceId });
    return deletedToken.deletedCount === 1;
  }

  async deleteAllExceptOne(userId: ObjectId, deviceId: string) {
    const deletedTokens = await this.authWhiteListModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return deletedTokens.deletedCount === 1;
  }

  async findTokens(userId: ObjectId, deviceId: string): Promise<any | null> {
    return this.authWhiteListModel.find({ userId: userId, deviceId: { $ne: deviceId } });
  }

  async findInvalidToken(token: string) {
    return this.authWhiteListModel.findOne({ token });
  }
}
