import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  _id: ObjectId;

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

  @Prop({ required: true })
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: any;
  };

  @Prop({ required: true })
  recoveryConfirmation: {
    recoveryCode: string;
    expirationDate: any;
  };

  @Prop({ required: true })
  isConfirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
