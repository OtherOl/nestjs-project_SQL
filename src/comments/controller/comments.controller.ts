import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { CommentsRepository } from '../repositories/comments.repository';
import { SendLikes } from '../../base/types/likes.model';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { TokenGuard } from '../../auth/guards/token.guard';
import { createCommentModel } from '../../base/types/comments.model';
import { UpdateCommentUseCase } from '../use-cases/updateComment.use-case';
import { DoLikesUseCase } from '../use-cases/doLikes.use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsRepository: CommentsRepository,
    private authService: AuthService,
    private updateCommentUseCase: UpdateCommentUseCase,
    private doLikesUseCase: DoLikesUseCase,
  ) {}

  @SkipThrottle()
  @Get(':id')
  @HttpCode(200)
  async getCommentById(@Param('id') id: string, @Req() request: Request) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    const comment = await this.commentsQueryRepository.getCommentById(id, userId);
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    return comment;
  }

  @SkipThrottle()
  @UseGuards(TokenGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() content: createCommentModel,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    return await this.updateCommentUseCase.updateComment(commentId, content.content, userId);
  }

  @SkipThrottle()
  @UseGuards(TokenGuard)
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
    return await this.doLikesUseCase.doLikes(userId, comment, likeStatus.likeStatus);
  }

  @SkipThrottle()
  @UseGuards(TokenGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(@Param('commentId') commentId: string, @Req() request: Request) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    await this.commentsRepository.deleteComment(commentId, userId);
    return;
  }
}
