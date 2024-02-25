import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthBlackList } from '../domain/auth-black_list.entity';

@Injectable()
export class AuthBlackListRepository {
  constructor(@InjectRepository(AuthBlackList) private authBlackListRepository: Repository<AuthBlackList>) {}

  async blackList(token: string) {
    return await this.authBlackListRepository.insert({ token });
  }

  async findInvalidToken(token: string) {
    return await this.authBlackListRepository.findOneBy({ token });
  }
}
