import { v4 as uuidv4 } from 'uuid';

export class Security {
  id: string;

  ip: string;

  title: string;

  lastActiveDate: string;

  deviceId: string;

  userId: string;

  static createSession(ip: string, title: string = 'Chrome 105', verifiedToken: any) {
    const session = new Security();

    session.id = uuidv4();
    session.ip = ip;
    session.title = title;
    session.lastActiveDate = new Date(verifiedToken.iat * 1000).toISOString();
    session.deviceId = verifiedToken.deviceId;
    session.userId = verifiedToken.userId;

    return session;
  }
}
