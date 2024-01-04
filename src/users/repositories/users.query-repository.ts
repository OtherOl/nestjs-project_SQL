import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/users.entity';
import { Model } from 'mongoose';
import { userModel } from '../../base/types/users.model';
import { paginationModel } from '../../base/types/pagination.model';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const filter = {
      $or: [
        { login: RegExp(searchLoginTerm, 'i') },
        { email: RegExp(searchEmailTerm, 'i') },
      ],
    };

    const countUsers: number = await this.userModel.countDocuments(filter);
    const foundUsers: userModel[] = await this.userModel
      .find(filter, {
        _id: 0,
        passwordHash: 0,
        passwordSalt: 0,
        emailConfirmation: 0,
        recoveryConfirmation: 0,
        isConfirmed: 0,
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

  async getUserById(_id: string) {
    return this.userModel.findOne({ _id: _id });
  }
}
