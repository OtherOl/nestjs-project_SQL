import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/users.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(newUser: any) {
    return await this.userModel.create(newUser);
  }

  async deleteUser(_id: string) {
    const deletedUser = await this.userModel.deleteOne({ _id: _id });
    return deletedUser.deletedCount === 1;
  }
}
