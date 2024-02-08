import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, _id: false })
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: string;
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema({ versionKey: false, _id: false })
export class RecoveryConfirmation {
  @Prop({ required: true })
  recoveryCode: string;

  @Prop({ required: true })
  expirationDate: string;
}

export const RecoveryConfirmationSchema = SchemaFactory.createForClass(RecoveryConfirmation);

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ type: EmailConfirmationSchema, required: true })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: RecoveryConfirmationSchema, required: true })
  recoveryConfirmation: RecoveryConfirmation;

  @Prop({ required: true })
  isConfirmed: boolean;

  static createNewUser(login: string, email: string, passwordHash: string, isConfirmed: boolean) {
    const user = new User();

    user.login = login;
    user.email = email;
    user.passwordHash = passwordHash;
    user.createdAt = new Date().toISOString();
    user.emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 3 }).toISOString(),
    };
    user.recoveryConfirmation = {
      recoveryCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 1000 }).toISOString(),
    };
    user.isConfirmed = isConfirmed;

    return user;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
