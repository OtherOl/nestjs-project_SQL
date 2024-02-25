import { User } from '../../users/domain/users.entity';

export type securityViewModel = {
  id: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  userId: string;
};

export type securityTimeViewModel = {
  id: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  userId: User;
};
