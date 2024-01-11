import { ObjectId } from 'mongodb';

export type securityViewModel = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  userId: string;
};
