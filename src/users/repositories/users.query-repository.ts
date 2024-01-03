import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersQueryRepository {
  getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ) {
    return;
  }

  getUserById(id: string) {
    return id;
  }
}
