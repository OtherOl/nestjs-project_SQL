import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get()
  getCommentById(@Param('id') id: string) {
    return this.commentsQueryRepository.getCommentById(id);
  }
}
