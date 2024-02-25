import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuthBlackList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;
}
