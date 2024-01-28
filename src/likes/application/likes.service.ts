import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Likes } from '../domain/likes.entity';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService {
  constructor(private likesRepository: LikesRepository) {}

  async createNewCommentLike(userId: ObjectId, commentId: ObjectId, type: string) {
    const like = Likes.createCommentLike(userId, commentId, type);
    await this.likesRepository.createLike(like);
    return like;
  }

  async createNewPostLike(userId: ObjectId, postId: ObjectId, type: string, userLogin: string) {
    const like = Likes.createPostLike(userId, postId, type, userLogin);
    await this.likesRepository.createLike(like);
    return like;
  }
}
