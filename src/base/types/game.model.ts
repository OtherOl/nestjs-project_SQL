import { IsArray, IsBoolean, IsString, Length } from 'class-validator';

export enum AnswerStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

export class AnswerViewModel {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
}

export class QuestionsViewModel {
  id: string;
  body: string;
}

export class Player {
  id: string;
  login: string;
}

export class GameViewModel {
  id: string;
  firstPlayerProgress: null | PlayerGameModel;
  secondPlayerProgress: null | PlayerGameModel;
  questions: null | QuestionsViewModel[];
  status: GameStatus;
  pairCreatedDate: string;
  startGameDate: null | string;
  finishGameDate: null | string;
}

export class PlayerGameModel {
  answers: AnswerViewModel[];
  player: Player;
  score: number;
}

export class CreateQuestionModel {
  @IsString()
  @Length(10, 500)
  body: string;

  @IsArray()
  correctAnswers: string[];
}

export class UpdatePublished {
  @IsBoolean()
  // @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  published: boolean;
}

export class FindById {
  @IsString()
  id: string;
}
