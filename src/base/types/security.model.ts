import { ObjectId } from 'mongodb';

export type securityViewModel = {
  id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  userId: string;
};

export type securityViewModelSQL = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  userId: string;
};
