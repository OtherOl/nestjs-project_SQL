import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../../auth/guards/accessToken.guard';
import { GetUnfinishedGameUseCase } from '../use-cases/getUnfinishedGame.use-case';
import { Request } from 'express';
import { CreateOrConnectGameUseCase } from '../use-cases/createOrConnectGame.use-case';
import { GetGameByIdUseCase } from '../use-cases/getGameById.use-case';
import { SendAnswersUseCase } from '../use-cases/sendAnswers.use-case';
import { SkipThrottle } from '@nestjs/throttler';
import { GetAllUserGamesUseCase } from '../use-cases/getAllUserGames.use-case';
import { GetStatisticUseCase } from '../use-cases/getStatistic.use-case';

@Controller('pair-game-quiz/pairs')
export class PairQuizGameController {
  constructor(
    private getUnfinishedGameUseCase: GetUnfinishedGameUseCase,
    private createOrConnectGameUseCase: CreateOrConnectGameUseCase,
    private getGameByIdUseCase: GetGameByIdUseCase,
    private sendAnswersUseCase: SendAnswersUseCase,
    private getAllUserGamesUseCase: GetAllUserGamesUseCase,
    private getStatisticUseCase: GetStatisticUseCase,
  ) {}

  @SkipThrottle()
  @Get('my')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async getAllMyGames(
    @Req() req: Request,
    @Query() query: { sortBy: string; sortDirection: string; pageNumber: number; pageSize: number },
  ) {
    return await this.getAllUserGamesUseCase.getGames(
      req.headers.authorization!,
      query.sortBy,
      query.sortDirection,
      query.pageNumber,
      query.pageSize,
    );
  }

  @SkipThrottle()
  @Get('my-statistic')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async getMyStatistic(@Req() req: Request) {
    return await this.getStatisticUseCase.getStatistic(req.headers.authorization!);
  }

  @SkipThrottle()
  @Get('my-current')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async getUnfinishedGame(@Req() req: Request) {
    return await this.getUnfinishedGameUseCase.getGame(req.headers.authorization!);
  }

  @SkipThrottle()
  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async getGameById(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return await this.getGameByIdUseCase.getGame(req.headers.authorization!, id);
  }

  @SkipThrottle()
  @Post('connection')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async createOrConnectGame(@Req() req: Request) {
    return await this.createOrConnectGameUseCase.createOrConnect(req.headers.authorization!);
  }

  @SkipThrottle()
  @Post('my-current/answers')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async sendAnswer(@Req() req: Request, @Body('answer') answer: string) {
    return await this.sendAnswersUseCase.sendAnswers(answer, req.headers.authorization!);
  }
}
