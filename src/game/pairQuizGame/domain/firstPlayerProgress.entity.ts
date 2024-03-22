import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AnswerViewModel, Player } from '../../../base/types/game.model';
import { PairQuizGame } from './pairQuizGame.entity';

@Entity({ name: 'FirstPlayerProgress' })
export class FirstPlayerProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { array: true, default: {} })
  answers: AnswerViewModel[];

  @Column({ type: 'jsonb' })
  player: Player;

  @Column()
  score: number;

  @Index('indexGameIdFirst')
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

  static createFirstPlayer(userId: string, login: string, gameId: string) {
    const player = new FirstPlayerProgress();

    player.player = {
      id: userId,
      login: login,
    };
    player.score = 0;
    player.gameId = gameId;

    return player;
  }
}
