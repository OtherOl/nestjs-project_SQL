import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';
import { commentsModel } from '../../base/types/comments.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async getCommentById(id: string): Promise<commentsModel | null> {
    return this.commentModel.findOne({ id: new ObjectId(id) });
  }
}
