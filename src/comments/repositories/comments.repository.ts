import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async updateComment(commentId: string, content: string) {
    const comment = await this.commentModel.updateOne(
      {
        id: new ObjectId(commentId),
      },
      { $set: { content } },
    );
    return comment.modifiedCount === 1;
  }

  async deleteComment(commentId: string, userId: string) {
    const user = await this.usersQueryRepository.getUserById(new ObjectId(userId));
    const comment = await this.commentModel.findOne({ id: new ObjectId(commentId) });
    if (!comment) throw new NotFoundException("Comment doesn't exists");
    if (!user!.id.equals(comment.commentatorInfo.userId)) throw new ForbiddenException();
    await this.commentModel.deleteOne({
      id: new ObjectId(commentId),
    });
    return;
  }

  async addLike(commentId: ObjectId) {
    return this.commentModel.updateOne({ id: commentId }, { $inc: { 'likesInfo.likesCount': +1 } });
  }

  async decreaseLike(commentId: ObjectId) {
    return this.commentModel.updateOne({ id: commentId }, { $inc: { 'likesInfo.likesCount': -1 } });
  }

  async addDislike(commentId: ObjectId) {
    return this.commentModel.updateOne({ id: commentId }, { $inc: { 'likesInfo.dislikesCount': +1 } });
  }

  async decreaseDislike(commentId: ObjectId) {
    return this.commentModel.updateOne({ id: commentId }, { $inc: { 'likesInfo.dislikesCount': -1 } });
  }
}
