import { Injectable } from '@nestjs/common';
import { createUserModel } from '../../base/types/users.model';
import { UsersRepository } from '../repositories/users.repository';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async createUser(inputData: createUserModel) {
    const newUser = {
      _id: new ObjectId(),
      login: inputData.login,
      email: inputData.email,
      createdAt: new Date().toISOString(),
    };
    return await this.usersRepository.createUser(newUser);
  }

  async deleteUser(_id: string) {
    const user = await this.usersQueryRepository.getUserById(_id);
    if (!user) return false;
    return await this.usersRepository.deleteUser(_id);
  }
}
