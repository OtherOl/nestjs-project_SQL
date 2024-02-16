import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class AuthBlackList {
  @Prop()
  token: string;

  @Prop()
  deviceId: string;
}

export const AuthBlackListSchema = SchemaFactory.createForClass(AuthBlackList);
