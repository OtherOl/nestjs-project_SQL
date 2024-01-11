import { BadRequestException, Injectable } from '@nestjs/common';
import { createUserModel, userModel } from '../../base/types/users.model';
import { UsersRepository } from '../repositories/users.repository';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';
import { AuthService } from '../../auth/application/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private authService: AuthService,
  ) {}

  async createUserForRegistration(inputData: createUserModel) {
    const isExists = await this.usersQueryRepository.findByLoginOrEmail(inputData.email);
    const isExistsLogin = await this.usersQueryRepository.findByLoginOrEmail(inputData.login);
    if (isExists)
      throw new BadRequestException([{ message: 'User with current email already exists', field: 'email' }]);
    if (isExistsLogin)
      throw new BadRequestException([{ message: 'User with current login already exists', field: 'login' }]);

    const passwordHash = await this.authService.createPasswordHash(inputData.password);

    const newUser: userModel = {
      id: new ObjectId(),
      login: inputData.login,
      email: inputData.email,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { minutes: 3 }),
      },
      recoveryConfirmation: {
        recoveryCode: uuidv4(),
        expirationDate: add(new Date(), { minutes: 1000 }),
      },
      isConfirmed: false,
    };
    //There should be sent email message !!!
    await this.usersRepository.createUser(newUser);
    return;
  }

  async createUser(inputData: createUserModel) {
    const newUser = {
      id: new ObjectId(),
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
