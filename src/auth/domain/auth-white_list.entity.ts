import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthWhiteListDocument = HydratedDocument<AuthWhitelist>;

@Schema({ versionKey: false })
export class AuthWhitelist {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  deviceId: string;
}

export const AuthWhiteListSchema = SchemaFactory.createForClass(AuthWhitelist);
