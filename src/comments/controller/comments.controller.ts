import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { CommentsService } from '../application/comments.service';
import { CommentsRepository } from '../repositories/comments.repository';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
    private commentsRepository: CommentsRepository,
  ) {}

  @Get()
  @HttpCode(200)
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentsQueryRepository.getCommentById(id);
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    return comment;
  }

  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() content: string,
  ) {
    const comment = await this.commentsService.updateComment(
      commentId,
      content,
    );
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    return;
  }

  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(@Param('commentId') commentId: string) {
    const deletedComment =
      await this.commentsRepository.deleteComment(commentId);
    if (!deletedComment) throw new NotFoundException("Comment doesn't exists");
    return;
  }
}
