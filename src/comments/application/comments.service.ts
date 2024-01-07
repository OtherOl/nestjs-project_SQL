import { Injectable } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { CommentsRepository } from '../repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async updateComment(commentId: string, content: string) {
    const comment =
      await this.commentsQueryRepository.getCommentById(commentId);
    if (!comment) return null;
    return await this.commentsRepository.updateComment(commentId, content);
  }
}
