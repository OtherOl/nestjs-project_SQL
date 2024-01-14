import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ versionKey: false })
export class Auth {
  @Prop()
  token: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
