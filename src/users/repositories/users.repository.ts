import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/users.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(newUser: any) {
    await this.userModel.create(newUser);
    return newUser;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.deleteOne({
      id: new ObjectId(id),
    });
    return deletedUser.deletedCount === 1;
  }

  async updateConfirmation(userId: ObjectId) {
    return this.userModel.updateOne({ id: userId }, { $set: { isConfirmed: true } });
  }

  async changeConfirmationCode(userId: ObjectId, code: string) {
    return this.userModel.updateOne({ id: userId }, { $set: { 'emailConfirmation.confirmationCode': code } });
  }

  async updatePassword(userId: ObjectId, passwordHash: string) {
    return this.userModel.updateOne({ id: userId }, { $set: { passwordHash: passwordHash } });
  }
}
