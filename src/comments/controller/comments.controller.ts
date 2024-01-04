import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get()
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentsQueryRepository.getCommentById(id);
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    return comment;
  }
}
