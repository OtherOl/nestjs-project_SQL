import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
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

  async deleteComment(commentId: string) {
    const comment = await this.commentModel.deleteOne({
      id: new ObjectId(commentId),
    });
    return comment.deletedCount === 1;
  }
}
