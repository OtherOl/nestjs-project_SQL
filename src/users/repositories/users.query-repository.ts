import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/users.entity';
import { Model } from 'mongoose';
import { ConfirmationCode, userModel, userModelSQL } from '../../base/types/users.model';
import { paginationModel } from '../../base/types/pagination.model';
import { ObjectId } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async getAllUsers(
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ) {
    const countUsers: number = await this.dataSource.query(
      `SELECT COUNT(*)
            FROM public."Users"
            WHERE "login" LIKE $1
            OR "email" LIKE $2`,
      [`%${searchLoginTerm}%`, `%${searchEmailTerm}%`],
    );

    const foundUsers: userModel[] = await this.dataSource.query(
      `SELECT id, login, email, "createdAt"
            FROM public."Users"
            WHERE "login" LIKE $1
            OR "email" LIKE $2
            ORDER BY "${sortBy}" ${sortDirection}
            LIMIT $3 OFFSET $4`,
      [`%${searchLoginTerm}%`, `%${searchEmailTerm}%`, pageSize, (pageNumber - 1) * pageSize],
    );

    const users: paginationModel<userModel> = {
      pagesCount: Math.ceil(Number(countUsers[0].count) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countUsers[0].count),
      items: foundUsers,
    };

    return users;
  }

  async getUserById(id: ObjectId): Promise<userModel | null> {
    return this.userModel.findOne({ id: id }, { _id: 0 });
  }

  async getUserByIdSQL(id: string) {
    const result = await this.dataSource.query(
      `SELECT id, login, email, "createdAt"
            FROM public."Users"
                WHERE "id" = $1`,
      [`${id}`],
    );
    return result[0];
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const foundedUser = await this.dataSource.query(
      `SELECT id, login, email, "createdAt", "isConfirmed", "passwordHash", "recoveryConfirmation"
            FROM public."Users"
            WHERE login = $1
            OR email = $1`,
      [loginOrEmail],
    );
    return foundedUser[0];
  }

  async findUserByConfirmationCode(code: ConfirmationCode): Promise<userModelSQL | null> {
    const user = await this.dataSource.query(
      `
           SELECT *
            FROM public."Users"
            WHERE "emailConfirmation" ->> 'confirmationCode' = $1
    `,
      [code.code],
    );
    return user[0];
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<userModel | null> {
    const user = await this.dataSource.query(
      `
           SELECT *
            FROM public."Users"
            WHERE "recoveryConfirmation" ->> 'recoveryCode' = $1
    `,
      [recoveryCode],
    );
    return user[0];
  }
}
