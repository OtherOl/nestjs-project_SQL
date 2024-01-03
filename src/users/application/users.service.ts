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

  createUser(inputData: createUserModel) {
    const newUser = {
      _id: new ObjectId(),
      login: inputData.login,
      email: inputData.email,
      createdAt: new Date().toISOString(),
    };
    return this.usersRepository.createUser(newUser);
  }

  deleteUser(id: string) {
    const user = this.usersQueryRepository.getUserById(id);
    if (!user) return false;
    return this.usersRepository.deleteUser(id);
  }
}
