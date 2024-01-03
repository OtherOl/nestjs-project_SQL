import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { createUserModel } from '../../base/types/users.model';
import { UsersService } from '../application/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get()
  getAllUsers(
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
    return this.usersQueryRepository.getAllUsers(
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      query.searchLoginTerm,
      query.searchEmailTerm,
    );
  }

  @Post()
  createUser(@Body() inputData: createUserModel) {
    return this.usersService.createUser(inputData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const user = this.usersService.deleteUser(id);
    if (!user) throw new NotFoundException("User doesn't exists");
    return user;
  }
}
