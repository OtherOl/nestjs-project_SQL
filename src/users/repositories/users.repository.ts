import { Injectable } from '@nestjs/common';
import { userModel } from '../../base/types/users.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createUserSQL(newUser: userModel) {
    const id = uuidv4();
    await this.dataSource.query(
      `INSERT INTO public."Users"
        (id, login, email, "passwordHash", "createdAt", "emailConfirmation", "recoveryConfirmation", "isConfirmed")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        id,
        newUser.login,
        newUser.email,
        newUser.passwordHash,
        newUser.createdAt,
        {
          confirmationCode: newUser.emailConfirmation.confirmationCode,
          expirationDate: newUser.emailConfirmation.expirationDate,
        },
        {
          recoveryCode: newUser.recoveryConfirmation.recoveryCode,
          expirationDate: newUser.recoveryConfirmation.expirationDate,
        },
        newUser.isConfirmed,
      ],
    );

    return {
      id: id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  async deleteUser(id: string) {
    return await this.dataSource.query(
      `
        DELETE
        FROM public."Users"
        WHERE "id" = $1`,
      [`${id}`],
    );
  }

  async updateConfirmation(userId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Users"
            SET "isConfirmed" = true
            WHERE id = $1;`,
      [userId],
    );
  }

  async changeConfirmationCode(userId: string, code: string) {
    const newExpDate = add(new Date(), { minutes: 3 }).toISOString();
    await this.dataSource.query(
      `
        UPDATE public."Users"
            SET "emailConfirmation" = jsonb_set("emailConfirmation", '{confirmationCode}', '"${code}"')
            WHERE id = $1;`,
      [userId],
    );
    return await this.dataSource.query(
      `
         UPDATE public."Users"
            SET "emailConfirmation" = jsonb_set("emailConfirmation", '{expirationDate}', '"${newExpDate}"')
            WHERE id = $1;
    `,
      [userId],
    );
  }

  async updatePassword(userId: string, passwordHash: string) {
    return await this.dataSource.query(
      `
           UPDATE public."Users"
            SET "passwordHash" = $1
            WHERE id = $2;
    `,
      [passwordHash, userId],
    );
  }
}
