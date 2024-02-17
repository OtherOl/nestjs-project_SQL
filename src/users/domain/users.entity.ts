import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';

export class EmailConfirmation {
  confirmationCode: string;
  expirationDate: string;
}

export class RecoveryConfirmation {
  recoveryCode: string;
  expirationDate: string;
}

export class User {
  id: string;

  login: string;

  email: string;

  passwordHash: string;

  createdAt: string;

  emailConfirmation: EmailConfirmation;

  recoveryConfirmation: RecoveryConfirmation;

  isConfirmed: boolean;

  static createNewUser(login: string, email: string, passwordHash: string, isConfirmed: boolean) {
    const user = new User();

    user.id = uuidv4();
    user.login = login;
    user.email = email;
    user.passwordHash = passwordHash;
    user.createdAt = new Date().toISOString();
    user.emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 3 }).toISOString(),
    };
    user.recoveryConfirmation = {
      recoveryCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 1000 }).toISOString(),
    };
    user.isConfirmed = isConfirmed;

    return user;
  }
}
