import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type SecurityDocument = HydratedDocument<Security>;

@Schema({ versionKey: false })
export class Security {
  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastActivateDate: Date;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  userId: string;
}

export const SecuritySchema = SchemaFactory.createForClass(Security);
