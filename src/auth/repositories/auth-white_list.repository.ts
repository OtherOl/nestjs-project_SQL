import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthBlackListRepository } from './auth-black-list-repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthWhiteList } from '../domain/auth-white_list.entity';

@Injectable()
export class AuthWhiteListRepository {
  constructor(
    @InjectRepository(AuthWhiteList)
    private authWhiteListRepository: Repository<AuthWhiteList>,
    private authBlackListRepository: AuthBlackListRepository,
  ) {}

  async createNewToken(token: string, userId: string, deviceId: string) {
    return await this.authWhiteListRepository.insert({ token, userId, deviceId });
  }

  async deleteToken(token: string) {
    return await this.authWhiteListRepository.delete({ token });
  }

  async deleteTokenByDeviceId(deviceId: string) {
    const refreshToken = await this.authWhiteListRepository.findOneBy({ deviceId });
    await this.authBlackListRepository.blackList(refreshToken!.token);
    return await this.authWhiteListRepository.delete({ deviceId });
  }

  async deleteAllExceptOne(userId: string, deviceId: string) {
    return await this.authWhiteListRepository
      .createQueryBuilder()
      .delete()
      .from(AuthWhiteList)
      .where('userId = :userId', { userId })
      .andWhere('deviceId = :deviceId', { deviceId })
      .execute();
  }

  async findTokens(userId: ObjectId, deviceId: string): Promise<any | null> {
    return await this.authWhiteListRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId })
      .andWhere(`deviceId = :deviceId`, { deviceId })
      .getMany();
  }
}
