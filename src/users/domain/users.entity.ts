import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, _id: false })
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: string;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

@Schema({ versionKey: false, _id: false })
export class RecoveryConfirmation {
  @Prop({ required: true })
  recoveryCode: string;

  @Prop({ required: true })
  expirationDate: string;
}

export const RecoveryConfirmationSchema =
  SchemaFactory.createForClass(RecoveryConfirmation);

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
  passwordSalt: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true, type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;

  @Prop({ required: true, type: RecoveryConfirmationSchema })
  recoveryConfirmation: RecoveryConfirmation;

  @Prop({ required: true })
  isConfirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
