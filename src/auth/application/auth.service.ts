import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserLogin } from '../../base/types/users.model';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
  ) {}

  async createPasswordHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async checkCredentials(inputData: UserLogin) {
    const foundedUser = await this.usersQueryRepository.findByLoginOrEmail(inputData.loginOrEmail);
    if (!foundedUser) throw new UnauthorizedException();
    //if (!foundedUser.isConfirmed) throw new UnauthorizedException();
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
}
