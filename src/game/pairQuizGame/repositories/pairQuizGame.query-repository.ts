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
    const game = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .where('g.id = :gameId', { gameId })
      .leftJoinAndMapOne('g.firstPlayerProgress', 'g.firstPlayer', 'f')
      .leftJoinAndMapOne('g.secondPlayerProgress', 'g.secondPlayer', 's')
      .select([
        'g.id',
        'f.answers',
        'f.player',
        'f.score',
        's.answers',
        's.player',
        's.score',
        'g.questions',
        'g.status',
        'g.pairCreatedDate',
        'g.startGameDate',
        'g.finishGameDate',
      ])
      .getOne();

    if (!game) {
      return null;
    } else if (game.status === 'PendingSecondPlayer') {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
        questions: null,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    } else {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
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
      .leftJoinAndMapOne('g.firstPlayerProgress', 'g.firstPlayer', 'f')
      .leftJoinAndMapOne('g.secondPlayerProgress', 'g.secondPlayer', 's')
      .select([
        'g.id',
        'f.answers',
        'f.player',
        'f.score',
        's.answers',
        's.player',
        's.score',
        'g.questions',
        'g.status',
        'g.pairCreatedDate',
        'g.startGameDate',
        'g.finishGameDate',
      ])
      .getOne();

    if (!game) {
      return null;
    } else if (game.status === 'PendingSecondPlayer') {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
        questions: null,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    } else {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
        questions: game.questions,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    }
  }

  async getAllMyGames(
    userId: string,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
    pageNumber: number,
    pageSize: number,
  ) {
    const countGames = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .where(
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
      .getCount();

    const game = await this.pairQuizGameRepository
      .createQueryBuilder('g')
      .where(
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
      .leftJoinAndMapOne('g.firstPlayerProgress', 'g.firstPlayer', 'f')
      .leftJoinAndMapOne('g.secondPlayerProgress', 'g.secondPlayer', 's')
      .select([
        'g.id',
        'f.answers',
        'f.player',
        'f.score',
        's.answers',
        's.player',
        's.score',
        'g.questions',
        'g.status',
        'g.pairCreatedDate',
        'g.startGameDate',
        'g.finishGameDate',
      ])
      .orderBy(`g.${sortBy}`, sortDirection)
      .addOrderBy('g.pairCreatedDate', 'DESC')
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    const userGames = game.map((game) => {
      return {
        id: game.id,
        firstPlayerProgress: game.firstPlayerProgress,
        secondPlayerProgress: game.secondPlayerProgress,
        questions: game.questions,
        status: game.status,
        pairCreatedDate: game.pairCreatedDate,
        startGameDate: game.startGameDate,
        finishGameDate: game.finishGameDate,
      };
    });

    return {
      pagesCount: Math.ceil(Number(countGames) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countGames),
      items: userGames,
    };
  }

  async getMyStatistic(userId: string) {
    const first = await this.firstPlayerProgressRepository
      .createQueryBuilder('f')
      .select([
        'Sum(f.winsCount) as "winsCount"',
        'Sum(f.lossesCount) as "lossesCount"',
        'Sum(f.drawsCount) as "drawsCount"',
        'Sum(f.gamesCount) as "gamesCount"',
        'Sum(f.score) as score',
      ])
      .where('f.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getRawOne();

    const second = await this.secondPlayerProgressRepository
      .createQueryBuilder('s')
      .select([
        'Sum(s.winsCount) as "winsCount"',
        'Sum(s.lossesCount) as "lossesCount"',
        'Sum(s.drawsCount) as "drawsCount"',
        'Sum(s.gamesCount) as "gamesCount"',
        'Sum(s.score) as score',
      ])
      .where('s.player ::jsonb @> :player', {
        player: {
          id: userId,
        },
      })
      .getRawOne();

    const sumScore = +first.score + +second.score;
    const gamesCount = +first.gamesCount + +second.gamesCount;
    const avgScore = Number((sumScore / gamesCount).toFixed(2));

    return {
      sumScore: sumScore,
      avgScores: avgScore === Infinity ? 0 : avgScore || 0,
      gamesCount: gamesCount,
      winsCount: +first.winsCount + +second.winsCount,
      lossesCount: +first.lossesCount + +second.lossesCount,
      drawsCount: +first.drawsCount + +second.drawsCount,
    };
  }
}
