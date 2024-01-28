import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { UsersRepository } from '../repositories/users.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}

  async deleteUser(id: ObjectId) {
    const user = await this.usersQueryRepository.getUserById(id);
    if (!user) return false;
    return await this.usersRepository.deleteUser(id);
  }
}
