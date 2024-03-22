import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AnswerViewModel, Player } from '../../../base/types/game.model';
import { PairQuizGame } from './pairQuizGame.entity';

@Entity({ name: 'SecondPlayerProgress' })
export class SecondPlayerProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { array: true, default: {} })
  answers: AnswerViewModel[];

  @Column({ type: 'jsonb' })
  player: Player;

  @Column()
  score: number;

  @Index('indexGameIdSecond')
  @Column()
  gameId: string;

  @Column({ nullable: true })
  answerFinishDate: string;

  @OneToOne(() => PairQuizGame, (p) => p.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: string;

  @Column({ default: 0 })
  winsCount: number;

  @Column({ default: 0 })
  lossesCount: number;

  @Column({ default: 0 })
  drawsCount: number;

  @Column({ default: 0 })
  gamesCount: number;

  static createSecondPlayer(userId: string, login: string, gameId: string) {
    const player = new SecondPlayerProgress();

    player.player = {
      id: userId,
      login: login,
    };
    player.score = 0;
    player.gameId = gameId;

    return player;
  }
}
