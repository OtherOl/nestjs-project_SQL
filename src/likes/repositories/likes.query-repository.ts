import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Likes, LikesDocument } from '../domain/likes.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectModel(Likes.name) private likesModel: Model<LikesDocument>) {}

  async getLikeByCommentId(userId: ObjectId, commentId: ObjectId) {
    return this.likesModel.findOne({ userId, commentId });
  }

  async getLikeByUserId(userId: ObjectId) {
    return this.likesModel.find({ userId });
  }

  async getLikeByPostId(userId: ObjectId, postId: ObjectId) {
    return this.likesModel.findOne({ userId, postId });
  }

  async getNewestLikes(type: string) {
    return this.likesModel
      .find({ type, postId: { $exists: true } }, { _id: 0 })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }

  async getNewestLikeForCurrentPost(postId: ObjectId, type: string) {
    return this.likesModel
      .find({ postId, type }, { _id: 0, id: 0, type: 0, postId: 0 })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }
}
