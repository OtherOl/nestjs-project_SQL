import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Likes, LikesDocument } from '../domain/likes.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectModel(Likes.name) private likesModel: Model<LikesDocument>) {}

  async getLikeById(userId: ObjectId, commentId: ObjectId) {
    return this.likesModel.findOne({ userId, commentId });
  }

  async getLikeByUserId(userId: ObjectId) {
    return this.likesModel.find({ userId });
  }
}
