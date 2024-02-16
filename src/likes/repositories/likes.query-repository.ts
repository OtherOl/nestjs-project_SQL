import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getLikeByCommentId(userId: string, commentId: string) {
    return await this.dataSource.query(
      `
        SELECT *
        FROM public."Likes"
        WHERE "commentId" = $1
        AND "userId" = $2
    `,
      [commentId, userId],
    );
  }

  async getLikeByUserId(userId: string) {
    return await this.dataSource.query(
      `
        SELECT *
        FROM public."Likes"
        WHERE "userId" = $1
    `,
      [userId],
    );
  }

  async getLikeByPostId(userId: string, postId: string) {
    const like = await this.dataSource.query(
      `
        SELECT *
        FROM public."Likes"
        WHERE "userId" = $1 
        AND "postId" = $2
    `,
      [userId, postId],
    );
    return like[0];
  }

  async getNewestLikes(type: string) {
    return await this.dataSource.query(
      `
        SELECT *
        FROM public."Likes"
        WHERE "postId" IS NOT NULL
        AND type = $1
        ORDER BY "addedAt" DESC
    `,
      [type],
    );
  }

  async getNewestLikeForCurrentPost(postId: string, type: string) {
    return await this.dataSource.query(
      `
        SELECT "addedAt", "userId", login
        FROM public."Likes"
        WHERE "postId" = $1
        AND type = $2
        ORDER BY "addedAt" DESC
        LIMIT 3
    `,
      [postId, type],
    );
  }
}
