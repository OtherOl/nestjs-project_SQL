import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsQueryRepository {
  getCommentById(id: string) {
    return id;
  }
}
