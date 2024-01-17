import { BadRequestException, Injectable } from '@nestjs/common';
import { createNewPassword, createUserModel, userModel } from '../../base/types/users.model';
import { UsersRepository } from '../repositories/users.repository';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { AuthService } from '../../auth/application/auth.service';
import { EmailManager } from '../../email/emailManager';
import { User } from '../domain/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private authService: AuthService,
    private emailManager: EmailManager,
  ) {}

  async createUserForRegistration(inputData: createUserModel) {
    const isExists = await this.usersQueryRepository.findByLoginOrEmail(inputData.email);
    const isExistsLogin = await this.usersQueryRepository.findByLoginOrEmail(inputData.login);
    if (isExists)
      throw new BadRequestException([{ message: 'User with current email already exists', field: 'email' }]);
    if (isExistsLogin)
      throw new BadRequestException([{ message: 'User with current login already exists', field: 'login' }]);

    const passwordHash = await this.authService.createPasswordHash(inputData.password);

    const newUser: userModel = User.createNewUser(inputData.login, inputData.email, passwordHash, false);

    await this.emailManager.sendEmailConfirmationCode(newUser);
    await this.usersRepository.createUser(newUser);
    return;
  }

  async createUser(inputData: createUserModel) {
    const passwordHash = await this.authService.createPasswordHash(inputData.password);

    const newUser: userModel = User.createNewUser(inputData.login, inputData.email, passwordHash, true);
    return await this.usersRepository.createUser(newUser);
  }

  async deleteUser(_id: string) {
    const user = await this.usersQueryRepository.getUserById(_id);
    if (!user) return false;
    return await this.usersRepository.deleteUser(_id);
  }

  async createNewPassword(inputData: createNewPassword) {
    const user = await this.usersQueryRepository.findUserByRecoveryCode(inputData.recoveryCode);
    if (!user) throw new BadRequestException([{ message: 'User not found', field: 'login' }]);
    if (user.recoveryConfirmation.recoveryCode !== inputData.recoveryCode)
      throw new BadRequestException([{ message: 'RecoveryCode is false', field: 'recoveryCode' }]);
    if (user.recoveryConfirmation.expirationDate < new Date())
      throw new BadRequestException([{ message: 'Date has expired', field: 'expirationDate' }]);

    const newPassword = await this.authService.createPasswordHash(inputData.password);
    await this.usersRepository.updatePassword(user.id, newPassword);
    return;
  }
}
