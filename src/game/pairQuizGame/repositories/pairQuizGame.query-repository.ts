import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairQuizGame } from '../domain/pairQuizGame.entity';
import { Brackets, Repository } from 'typeorm';
import { FirstPlayerProgress } from '../domain/firstPlayerProgress.entity';
import { SecondPlayerProgress } from '../domain/secondPlayerProgress.entity';
import { GameStatus } from '../../../base/types/game.model';

@Injectable()
export class PairQuizGameQueryRepository {
  constructor(
    @InjectRepository(PairQuizGame) private pairQuizGameRepository: Repository<PairQuizGame>,
    @InjectRepository(FirstPlayerProgress)
    private firstPlayerProgressRepository: Repository<FirstPlayerProgress>,
    @InjectRepository(SecondPlayerProgress)
    private secondPlayerProgressRepository: Repository<SecondPlayerProgress>,
  ) {}

  async getFirstPlayerByUserId(userId: string): Promise<FirstPlayerProgress | null> {
    return await this.firstPlayerProgressRepository
      .createQueryBuilder('p')
      .select()
      .where('p.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getOne();
  }

  async getSecondPlayerByUserId(userId: string): Promise<SecondPlayerProgress | null> {
    return await this.secondPlayerProgressRepository
      .createQueryBuilder('p')
      .select()
      .where('p.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getOne();
  }

  async getFirstPlayerByGameId(gameId: string) {
    return await this.firstPlayerProgressRepository.findOneBy({ gameId });
  }

  async getSecondPlayerByGameId(gameId: string) {
    return await this.secondPlayerProgressRepository.findOneBy({ gameId });
  }

  async getFirstPlayerByGameIdAndUserId(gameId: string, userId: string) {
    return await this.firstPlayerProgressRepository
      .createQueryBuilder('f')
      .select()
      .where('f.gameId = :gameId', { gameId })
      .andWhere('f.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getOne();
  }

  async getSecondPlayerByGameIdAndUserId(gameId: string, userId: string) {
    return await this.secondPlayerProgressRepository
      .createQueryBuilder('s')
      .select()
      .where('s.gameId = :gameId', { gameId })
      .andWhere('s.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getOne();
  }

  async getGameById(gameId: string) {
    const game = await this.pairQuizGameRepository.findOneBy({ id: gameId });
    const firstPlayer = await this.firstPlayerProgressRepository
      .createQueryBuilder('f')
      .select(['f.answers', 'f.player', 'f.score'])
      .where('f.gameId = :gameId', { gameId })
      .getOne();

    const secondPlayer = await this.secondPlayerProgressRepository
      .createQueryBuilder('f')
      .select(['f.answers', 'f.player', 'f.score'])
      .where('f.gameId = :gameId', { gameId })
      .getOne();

    if (!game) {
      return null;
    } else if (game.status === 'PendingSecondPlayer') {
      return {
        id: game.id,
        firstPlayerProgress: firstPlayer,
        secondPlayerProgress: secondPlayer,
        questions: null,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    } else {
      return {
        id: game.id,
        firstPlayerProgress: firstPlayer,
        secondPlayerProgress: secondPlayer,
        questions: game.questions,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    }
  }

  async getGameByStatus(status: GameStatus) {
    return await this.pairQuizGameRepository.findOneBy({ status });
  }

  async getUnfinishedGame(userId: string) {
    const game = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .select()
      .where('g.status != :status', { status: GameStatus.Finished })
      .andWhere(
        new Brackets((qb) => {
          qb.where('g.firstPlayerProgress :: jsonb @> :firstPlayerProgress', {
            firstPlayerProgress: {
              player: { id: userId },
            },
          }).orWhere('g.secondPlayerProgress :: jsonb @> :secondPlayerProgress', {
            secondPlayerProgress: {
              player: { id: userId },
            },
          });
        }),
      )
      .getOne();

    const firstPlayer = await this.firstPlayerProgressRepository
      .createQueryBuilder('f')
      .select(['f.answers', 'f.player', 'f.score'])
      .where('f.gameId = :gameId', { gameId: game?.id })
      .getOne();

    const secondPlayer = await this.secondPlayerProgressRepository
      .createQueryBuilder('f')
      .select(['f.answers', 'f.player', 'f.score'])
      .where('f.gameId = :gameId', { gameId: game?.id })
      .getOne();

    if (!game) {
      return null;
    } else if (game.status === 'PendingSecondPlayer') {
      return {
        id: game.id,
        firstPlayerProgress: firstPlayer,
        secondPlayerProgress: secondPlayer,
        questions: null,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    } else {
      return {
        id: game.id,
        firstPlayerProgress: firstPlayer,
        secondPlayerProgress: secondPlayer,
        questions: game.questions,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    }
  }
}
