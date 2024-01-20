import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Likes, LikesDocument } from '../domain/likes.entity';
import { Model } from 'mongoose';
import { CommentLikes } from '../../base/types/likes.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Likes.name) private likesModel: Model<LikesDocument>) {}

  async createLike(like: CommentLikes) {
    return await this.likesModel.create(like);
  }

  async updateLike(likeId: ObjectId, type: string) {
    return this.likesModel.updateOne({ id: likeId }, { $set: { type: type } });
  }
}
