import { ObjectId } from 'mongodb';

export type createUserModel = {
  login: string;
  password: string;
  email: string;
};

export type userModel = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
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
};
