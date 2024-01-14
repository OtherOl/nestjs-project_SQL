import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/users.entity';
import { Model } from 'mongoose';
import { ConfirmationCode, userModel } from '../../base/types/users.model';
import { paginationModel } from '../../base/types/pagination.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUsers(
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const filter = {
      $or: [{ login: RegExp(searchLoginTerm, 'i') }, { email: RegExp(searchEmailTerm, 'i') }],
    };

    const countUsers: number = await this.userModel.countDocuments(filter);
    const foundUsers: userModel[] = await this.userModel
      .find(filter, {
        _id: 0,
        passwordHash: 0,
        passwordSalt: 0,
        emailConfirmation: 0,
        recoveryConfirmation: 0,
      })
      .sort(sortQuery)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const users: paginationModel<userModel> = {
      pagesCount: Math.ceil(countUsers / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countUsers,
      items: foundUsers,
    };

    return users;
  }

  async getUserById(id: string) {
    return this.userModel.findOne({ id: new ObjectId(id) }, { _id: 0 });
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const foundedUser: userModel | null = await this.userModel.findOne(
      {
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      },
      { _id: 0 },
    );
    return foundedUser;
  }

  async findUserByConfirmationCode(code: ConfirmationCode): Promise<userModel | null> {
    return this.userModel.findOne({ 'emailConfirmation.confirmationCode': code.code });
  }
}
