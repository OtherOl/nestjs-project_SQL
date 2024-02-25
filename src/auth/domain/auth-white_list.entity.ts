import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuthWhiteList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  userId: string;

  @Column()
  deviceId: string;
}
