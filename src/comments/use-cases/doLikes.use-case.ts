import { Injectable } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { LikesService } from '../../likes/application/likes.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { LikesRepository } from '../../likes/repositories/likes.repository';
import { CommentViewModel } from '../../base/types/comments.model';

@Injectable()
export class DoLikesUseCase {
  constructor(
    private likesQueryRepository: LikesQueryRepository,
    private likesRepository: LikesRepository,
    private likesService: LikesService,
    private commentsRepository: CommentsRepository,
  ) {}

  async doLikes(userId: string, comment: CommentViewModel, likeStatus: string) {
    const like = await this.likesQueryRepository.getLikeByCommentId(userId, comment.id);
    if (likeStatus === 'Like') {
      if (!like[0]) {
        await this.likesService.createNewCommentLike(userId, comment.id, 'Like');
        await this.commentsRepository.addLike(comment.id);
        return;
      }
      if (like[0].type === 'Dislike') {
        await this.likesRepository.updateLike(like[0].id, 'Like');
        await this.commentsRepository.decreaseDislike(comment.id);
        await this.commentsRepository.addLike(comment.id);
        return;
      }
      if (like[0].type === 'None') {
        await this.likesRepository.updateLike(like[0].id, 'Like');
        await this.commentsRepository.addLike(comment.id);
        return;
      }
    }

    if (likeStatus === 'Dislike') {
      if (!like[0]) {
        await this.likesService.createNewCommentLike(userId, comment.id, 'Dislike');
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
      if (like[0].type === 'Like') {
        await this.likesRepository.updateLike(like[0].id, 'Dislike');
        await this.commentsRepository.decreaseLike(comment.id);
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
      if (like[0].type === 'None') {
        await this.likesRepository.updateLike(like[0].id, 'Dislike');
        await this.commentsRepository.addDislike(comment.id);
        return;
      }
    }

    if (likeStatus === 'None') {
      if (!like[0]) return;
      if (like[0].type === 'Like') {
        await this.likesRepository.updateLike(like[0].id, 'None');
        await this.commentsRepository.decreaseLike(comment.id);
        return;
      }
      if (like[0].type === 'Dislike') {
        await this.likesRepository.updateLike(like[0].id, 'None');
        await this.commentsRepository.decreaseDislike(comment.id);
        return;
      }
    }
  }
}
