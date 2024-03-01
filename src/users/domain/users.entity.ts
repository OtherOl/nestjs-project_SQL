import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Security } from '../../securityDevices/domain/security.entity';
import { Likes } from '../../likes/domain/likes.entity';
import { AuthWhiteList } from '../../auth/domain/auth-white_list.entity';

export class EmailConfirmation {
  confirmationCode: string;
  expirationDate: string;
}

export class RecoveryConfirmation {
  recoveryCode: string;
  expirationDate: string;
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  createdAt: string;

  @Column({ type: 'jsonb' })
  emailConfirmation: EmailConfirmation;

  @Column({ type: 'jsonb' })
  recoveryConfirmation: RecoveryConfirmation;

  @Column()
  isConfirmed: boolean;

  @OneToMany(() => Security, (s) => s.userId, { onDelete: 'CASCADE' })
  sessions: Security[];

  @OneToMany(() => Likes, (l) => l.usersId, { onDelete: 'CASCADE' })
  likes: Likes;

  @OneToMany(() => AuthWhiteList, (aw) => aw.usersId, { onDelete: 'CASCADE' })
  whiteTokens: AuthWhiteList;

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
