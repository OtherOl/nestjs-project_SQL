import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query-repository';
import { CommentsRepository } from '../repositories/comments.repository';
import { ObjectId } from 'mongodb';
import { CommentViewModel } from '../../base/types/comments.model';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { LikesService } from '../../likes/application/likes.service';
import { LikesRepository } from '../../likes/repositories/likes.repository';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsRepository: CommentsRepository,
    private likesQueryRepository: LikesQueryRepository,
    private likesService: LikesService,
    private likesRepository: LikesRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async updateComment(commentId: string, content: string, userId: string) {
    const user = await this.usersQueryRepository.getUserById(new ObjectId(userId));
    const comment = await this.commentsQueryRepository.getCommentById(commentId);
    if (user!.id !== comment.commentatorInfo.userId) throw new ForbiddenException();
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    await this.commentsRepository.updateComment(commentId, content);
    return;
  }

  async doLikes(userId: ObjectId, comment: CommentViewModel, likeStatus: string) {
    const like = await this.likesQueryRepository.getLikeByCommentId(new ObjectId(userId), comment.id);
    if (likeStatus === 'Like') {
      if (!like) {
        await this.likesService.createNewCommentLike(new ObjectId(userId), comment.id, 'Like');
        await this.commentsRepository.addLike(comment.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.commentsRepository.decreaseDislike(comment.id);
        await this.commentsRepository.addLike(comment.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.commentsRepository.addLike(comment.id);
        return;
      }
    }

    if (likeStatus === 'Dislike') {
      if (!like) {
        await this.likesService.createNewCommentLike(new ObjectId(userId), comment.id, 'Dislike');
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.commentsRepository.decreaseLike(comment.id);
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
    }

    if (likeStatus === 'None') {
      if (!like) return;
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.commentsRepository.decreaseLike(comment.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.commentsRepository.decreaseDislike(comment.id);
        return;
      }
    }
  }
}
