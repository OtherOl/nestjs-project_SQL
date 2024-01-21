import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private likesQueryRepository: LikesQueryRepository,
  ) {}
  async getCommentById(id: string, userId?: string) {
    const comment = await this.commentModel.findOne({ id: new ObjectId(id) }, { _id: 0, postId: 0 });
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    const like = await this.likesQueryRepository.getLikeByCommentId(new ObjectId(userId), comment.id);
    let likeStatus = '';
    if (!like) {
      likeStatus = 'None';
    } else {
      likeStatus = like.type;
    }
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: likeStatus,
      },
    };
  }
}
