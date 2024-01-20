import { Injectable } from '@nestjs/common';
import { LikesQueryRepository } from '../repositories/likes.query-repository';
import { ObjectId } from 'mongodb';
import { Likes } from '../domain/likes.entity';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class LikesService {
  constructor(
    private likesQueryRepository: LikesQueryRepository,
    private likesRepository: LikesRepository,
  ) {}

  async createNewLike(userId: ObjectId, commentId: ObjectId, type: string) {
    const like = Likes.createLike(userId, commentId, type);
    await this.likesRepository.createLike(like);
    return like;
  }
}
