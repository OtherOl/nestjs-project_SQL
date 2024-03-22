import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { GameStatus, QuestionsViewModel } from '../../../base/types/game.model';
import { FirstPlayerProgress } from './firstPlayerProgress.entity';
import { SecondPlayerProgress } from './secondPlayerProgress.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'PairQuizGame' })
export class PairQuizGame {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  firstPlayerProgress: null | FirstPlayerProgress;

  @Column({ type: 'jsonb', nullable: true })
  secondPlayerProgress: null | SecondPlayerProgress;

  @Column({ nullable: true, type: 'jsonb' })
  questions: QuestionsViewModel[];

  @Column({ enum: GameStatus })
  status: GameStatus;

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true, default: null })
  startGameDate: string;

  @Column({ nullable: true, default: null })
  finishGameDate: string;

  @OneToOne(() => FirstPlayerProgress, (f) => f.game, { onDelete: 'CASCADE' })
  firstPlayer: FirstPlayerProgress;

  @OneToOne(() => SecondPlayerProgress, (s) => s.game, { onDelete: 'CASCADE' })
  secondPlayer: SecondPlayerProgress;

  static createGame(questions: QuestionsViewModel[]) {
    const game = new PairQuizGame();

    game.id = uuidv4();
    game.questions = questions;
    game.status = GameStatus.PendingSecondPlayer;
    game.pairCreatedDate = new Date().toISOString();

    return game;
  }
}
