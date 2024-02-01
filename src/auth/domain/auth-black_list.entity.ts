import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthBlackListDocument = HydratedDocument<AuthBlackList>;

@Schema({ versionKey: false })
export class AuthBlackList {
  @Prop()
  token: string;

  @Prop()
  deviceId: string;
}

export const AuthBlackListSchema = SchemaFactory.createForClass(AuthBlackList);
