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
      .update()
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
      .update()
      .set({
        answers: () =>
          `"answers" || '{"questionId": "${answer.questionId}", "answerStatus": "${answer.answerStatus}", "addedAt": "${answer.addedAt}"}' ::jsonb`,
        score: () => `score ${score}`,
      })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async setFinishAnswerDateFirstPlayer(gameId: string) {
    return await this.firstPlayerProgressRepository.update(
      { gameId },
      { answerFinishDate: new Date().toISOString() },
    );
  }

  async setFinishAnswerDateSecondPlayer(gameId: string) {
    return await this.secondPlayerProgressRepository.update(
      { gameId },
      { answerFinishDate: new Date().toISOString() },
    );
  }

  async addBonusFirstPlayer(gameId: string) {
    return await this.firstPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ score: () => 'score + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async addBonusSecondPlayer(gameId: string) {
    return await this.secondPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ score: () => 'score + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async increaseGamesCountFirstPlayer(gameId: string) {
    return await this.firstPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ gamesCount: () => 'gamesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async increaseGamesCountSecondPlayer(gameId: string) {
    return await this.secondPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ gamesCount: () => 'gamesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async increaseWinsCountFirstPlayer(gameId: string) {
    return await this.firstPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ winsCount: () => 'winsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async increaseWinsCountSecondPlayer(gameId: string) {
    return await this.secondPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ winsCount: () => 'winsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async increaseLossesCountFirstPlayer(gameId: string) {
    return await this.firstPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ lossesCount: () => 'lossesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async increaseLossesCountSecondPlayer(gameId: string) {
    return await this.secondPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ lossesCount: () => 'lossesCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }

  async increaseDrawCount(gameId: string) {
    await this.firstPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ drawsCount: () => 'drawsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();

    return await this.secondPlayerProgressRepository
      .createQueryBuilder()
      .update()
      .set({ drawsCount: () => 'drawsCount + 1' })
      .where('gameId = :gameId', { gameId })
      .execute();
  }
}
