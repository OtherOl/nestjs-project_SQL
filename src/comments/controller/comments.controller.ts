import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Put, Req } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { CommentsService } from '../application/comments.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { SendLikes } from '../../base/types/likes.model';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
    private commentsRepository: CommentsRepository,
    private authService: AuthService,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async getCommentById(@Param('id') id: string, @Req() request: Request) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    const comment = await this.commentsQueryRepository.getCommentById(id, userId);
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    return comment;
  }

  @Put(':commentId')
  @HttpCode(204)
  async updateComment(@Param('commentId') commentId: string, @Body() content: string) {
    const comment = await this.commentsService.updateComment(commentId, content);
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    return;
  }

  @Put(':commentId/like-status')
  @HttpCode(204)
  async doLikeDislike(
    @Param('commentId') commentId: string,
    @Body() likeStatus: SendLikes,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    const comment = await this.commentsQueryRepository.getCommentById(commentId);
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    return await this.commentsService.doLikes(userId, comment, likeStatus.likeStatus);
  }

  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(@Param('commentId') commentId: string) {
    const deletedComment = await this.commentsRepository.deleteComment(commentId);
    if (!deletedComment) throw new NotFoundException("Comment doesn't exists");
    return;
  }
}
