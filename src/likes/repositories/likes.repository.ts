import { Injectable } from '@nestjs/common';
import { CommentLikes, PostLikes } from '../../base/types/likes.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createCommentLike(like: CommentLikes) {
    return await this.dataSource.query(
      `
        INSERT INTO public."Likes"(
            id, type, "addedAt", "userId", "commentId")
            VALUES ($1, $2, $3, $4, $5);
    `,
      [like.id, like.type, like.addedAt, like.userId, like.commentId],
    );
  }

  async createPostLike(like: PostLikes) {
    return await this.dataSource.query(
      `
        INSERT INTO public."Likes"(
            id, type, "addedAt", "userId", "postId", login)
            VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [like.id, like.type, like.addedAt, like.userId, like.postId, like.login],
    );
  }

  async updateLike(likeId: string, type: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Likes"
        SET type = $1
        WHERE id = $2
    `,
      [type, likeId],
    );
  }
}
