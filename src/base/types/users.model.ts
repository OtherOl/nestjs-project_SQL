import { ObjectId } from 'mongodb';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UserLogin {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;
}

export class createUserModel {
  @IsString()
  @Length(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;

  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

export class userModel {
  id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: any;
  };
  recoveryConfirmation: {
    recoveryCode: string;
    expirationDate: any;
  };
  isConfirmed: boolean;
}
