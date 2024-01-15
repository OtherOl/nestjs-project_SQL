import { BadRequestException, HttpCode, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfirmationCode, resendConfirmation, UserLogin } from '../../base/types/users.model';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../../users/repositories/users.repository';
import { EmailManager } from '../../email/emailManager';

@Injectable()
export class AuthService {
  constructor(
    private emailManager: EmailManager,
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
  ) {}

  async createPasswordHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async checkCredentials(inputData: UserLogin) {
    const foundedUser = await this.usersQueryRepository.findByLoginOrEmail(inputData.loginOrEmail);
    if (!foundedUser) throw new UnauthorizedException();
    if (!foundedUser.isConfirmed) throw new UnauthorizedException();
    const comparePassword = await bcrypt.compare(inputData.password, foundedUser.passwordHash);

    if (!comparePassword) throw new UnauthorizedException();
    return foundedUser;
  }

  async createAccessToken(userId: ObjectId) {
    return this.jwtService.sign({ userId: userId });
  }

  async createRefreshToken(userId: ObjectId) {
    return this.jwtService.sign({ userId: userId, deviceId: uuidv4() });
  }

  async confirmEmail(code: ConfirmationCode) {
    const user = await this.usersQueryRepository.findUserByConfirmationCode(code);
    if (!user) throw new BadRequestException([{ message: 'User not found', field: 'code' }]);
    if (user.isConfirmed)
      throw new BadRequestException([{ message: 'User already confirmed', field: 'code' }]);
    if (user.emailConfirmation.confirmationCode !== code.code)
      throw new BadRequestException([{ message: 'Invalid confirmationCode', field: 'code' }]);
    if (user.emailConfirmation.expirationDate < new Date())
      throw new BadRequestException([{ message: 'expirationDate expired', field: 'code' }]);

    return await this.usersRepository.updateConfirmation(user.id);
  }

  async resendConfirmation(email: resendConfirmation) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email.email);
    if (!user) throw new BadRequestException([{ message: "User doesn't exists", field: 'email' }]);
    if (user.isConfirmed)
      throw new BadRequestException([{ message: 'User already confirmed', field: 'email' }]);

    const confirmationCode = uuidv4();
    await this.usersRepository.changeConfirmationCode(user.id, confirmationCode);
    await this.emailManager.resendConfirmationCode(user, confirmationCode);
    return;
  }

  async verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  async passwordRecoveryCode(email: resendConfirmation) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email.email);
    if (!user) return HttpCode(204);
    await this.emailManager.sendRecoveryCode(user);
    return;
  }

  async getUserIdByToken(token: string) {
    if (!token) throw new UnauthorizedException();
    try {
      const user = await this.jwtService.verify(token);
      return user.id;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
