import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { createUserModel } from '../../base/types/users.model';
import { UsersService } from '../application/users.service';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ObjectId } from 'mongodb';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Get()
  @HttpCode(200)
  async getAllUsers(
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
      searchLoginTerm: string;
      searchEmailTerm: string;
    },
  ) {
    return await this.usersQueryRepository.getAllUsers(
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      query.searchLoginTerm,
      query.searchEmailTerm,
    );
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createUser(@Body() inputData: createUserModel) {
    return await this.usersService.createUser(inputData);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.deleteUser(new ObjectId(id));
    if (!user) throw new NotFoundException("User doesn't exists");
    return user;
  }
}
