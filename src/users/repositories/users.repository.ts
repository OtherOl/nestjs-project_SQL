import { Injectable } from '@nestjs/common';
import { userModel } from '../../base/types/users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { add } from 'date-fns/add';
import { User } from '../domain/users.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}
  async createUser(newUser: userModel) {
    await this.usersRepository.insert(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  async deleteUser(id: string) {
    return await this.usersRepository.delete({ id });
  }

  async updateConfirmation(userId: string) {
    return await this.usersRepository.update({ id: userId }, { isConfirmed: true });
  }

  async changeConfirmationCode(userId: string, code: string) {
    const newExpDate = add(new Date(), { minutes: 3 }).toISOString();
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        emailConfirmation: () => `jsonb_set("emailConfirmation", '{confirmationCode}', '"${code}"')`,
      })
      .where('id = :id', { id: userId })
      .execute();

    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        emailConfirmation: () => `jsonb_set("emailConfirmation", '{expirationDate}', '"${newExpDate}"')`,
      })
      .where(`id = :id`, { id: userId })
      .execute();
  }

  async updatePassword(userId: string, passwordHash: string) {
    return await this.usersRepository.update({ id: userId }, { passwordHash });
  }
}
