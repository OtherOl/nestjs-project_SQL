import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>) {}

  async updateComment(commentId: string, content: string) {
    return await this.commentsRepository.update({ id: commentId }, { content });
  }

  async deleteComment(commentId: string) {
    return await this.commentsRepository.delete({ id: commentId });
  }

  async addLike(commentId: string) {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{likesCount}', (COALESCE("likesInfo"->>'likesCount','0')::int + 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }

  async decreaseLike(commentId: string) {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{likesCount}', (COALESCE("likesInfo"->>'likesCount','0')::int - 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }

  async addDislike(commentId: string) {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{dislikesCount}', (COALESCE("likesInfo"->>'dislikesCount','0')::int + 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }

  async decreaseDislike(commentId: string) {
    return await this.commentsRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        likesInfo: () =>
          `jsonb_set("likesInfo", '{dislikesCount}', (COALESCE("likesInfo"->>'dislikesCount','0')::int - 1)::text::jsonb)`,
      })
      .where('id = :id', { id: commentId })
      .execute();
  }
}
