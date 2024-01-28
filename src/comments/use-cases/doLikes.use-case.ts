import { Injectable } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { LikesService } from '../../likes/application/likes.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { LikesRepository } from '../../likes/repositories/likes.repository';
import { ObjectId } from 'mongodb';
import { CommentViewModel } from '../../base/types/comments.model';

@Injectable()
export class DoLikesUseCase {
  constructor(
    private likesQueryRepository: LikesQueryRepository,
    private likesRepository: LikesRepository,
    private likesService: LikesService,
    private commentsRepository: CommentsRepository,
  ) {}

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
