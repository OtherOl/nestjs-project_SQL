import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairQuizGame } from '../domain/pairQuizGame.entity';
import { Repository } from 'typeorm';
import { FirstPlayerProgress } from '../domain/firstPlayerProgress.entity';
import { AnswerViewModel, GameStatus, PlayerGameModel } from '../../../base/types/game.model';
import { SecondPlayerProgress } from '../domain/secondPlayerProgress.entity';
import { Answer } from '../domain/answers.entity';

@Injectable()
export class PairQuizGameRepository {
  constructor(
    @InjectRepository(PairQuizGame) private pairQuizGameRepository: Repository<PairQuizGame>,
    @InjectRepository(FirstPlayerProgress)
    private firstPlayerProgressRepository: Repository<FirstPlayerProgress>,
    @InjectRepository(SecondPlayerProgress)
    private secondPlayerProgressRepository: Repository<SecondPlayerProgress>,
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
  ) {}

  async createNewGame(newGame: PairQuizGame, firstPlayer: PlayerGameModel) {
    return await this.pairQuizGameRepository.insert({
      id: newGame.id,
      firstPlayerProgress: firstPlayer,
      questions: newGame.questions,
      status: newGame.status,
      pairCreatedDate: newGame.pairCreatedDate,
      startGameDate: newGame.startGameDate,
      finishGameDate: newGame.finishGameDate,
    });
  }

  async createFirstPlayer(firstPlayer: FirstPlayerProgress) {
    return await this.firstPlayerProgressRepository.insert(firstPlayer);
  }

  async createSecondPlayer(secondPlayer: SecondPlayerProgress) {
    return await this.secondPlayerProgressRepository.insert(secondPlayer);
  }

  async changeGameStatusToActive(gameId: string, secondPlayer: PlayerGameModel) {
    return await this.pairQuizGameRepository.update(
      { id: gameId },
      {
        status: GameStatus.Active,
        startGameDate: new Date().toISOString(),
        secondPlayerProgress: secondPlayer,
      },
    );
  }

  async changeGameStatusToFinished(gameId: string) {
    return await this.pairQuizGameRepository.update(
      { id: gameId },
      { status: GameStatus.Finished, finishGameDate: new Date().toISOString() },
    );
  }

  async createAnswer(answer: Answer) {
    return await this.answerRepository.insert(answer);
  }

  async sendAnswerFirstPlayer(gameId: string, answer: AnswerViewModel, score: string) {
    return await this.firstPlayerProgressRepository
      .createQueryBuilder()
      .update(FirstPlayerProgress)
      .set({
        answers: () =>
          `"answers" || '{"questionId": "${answer.questionId}", "answerStatus": "${answer.answerStatus}", "addedAt": "${answer.addedAt}"}' ::jsonb`,
        score: () => `score ${score}`,
      })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async sendAnswerSecondPlayer(gameId: string, answer: AnswerViewModel, score: string) {
    return await this.secondPlayerProgressRepository
      .createQueryBuilder()
      .update(SecondPlayerProgress)
      .set({
        answers: () =>
          `"answers" || '{"questionId": "${answer.questionId}", "answerStatus": "${answer.answerStatus}", "addedAt": "${answer.addedAt}"}' ::jsonb`,
        score: () => `score ${score}`,
      })
      .where('gameId = :gameId', { gameId })
      .execute();
  }
}