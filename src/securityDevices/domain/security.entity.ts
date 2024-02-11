import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema({ versionKey: false })
export class Security {
  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastActiveDate: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  userId: string;

  static createSession(ip: string, title: string = 'Chrome 105', verifiedToken: any) {
    const session = new Security();

    session.ip = ip;
    session.title = title;
    session.lastActiveDate = new Date(verifiedToken.iat * 1000).toISOString();
    session.deviceId = verifiedToken.deviceId;
    session.userId = verifiedToken.userId;

    return session;
  }
}

export const SecuritySchema = SchemaFactory.createForClass(Security);
