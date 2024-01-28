import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { CommentsRepository } from '../repositories/comments.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsRepository: CommentsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async updateComment(commentId: string, content: string, userId: string) {
    const user = await this.usersQueryRepository.getUserById(new ObjectId(userId));
    const comment = await this.commentsQueryRepository.getCommentById(commentId);
    if (!user!.id.equals(comment.commentatorInfo.userId)) throw new ForbiddenException();
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    await this.commentsRepository.updateComment(commentId, content);
    return;
  }
}
