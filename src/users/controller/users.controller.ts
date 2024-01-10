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

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

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

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createUser(@Body() inputData: createUserModel) {
    return await this.usersService.createUser(inputData);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') _id: string) {
    const user = await this.usersService.deleteUser(_id);
    if (!user) throw new NotFoundException("User doesn't exists");
    return user;
  }
}
