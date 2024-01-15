import { ObjectId } from 'mongodb';

export type securityViewModel = {
  id: ObjectId;
  ip: string;
  title: string;
  lastActivateDate: string;
  deviceId: string;
  userId: string;
};
