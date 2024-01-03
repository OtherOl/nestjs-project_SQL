import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  createUser(newUser) {}

  deleteUser(id: string) {}
}
