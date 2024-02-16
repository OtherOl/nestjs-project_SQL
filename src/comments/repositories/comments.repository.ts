import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async updateComment(commentId: string, content: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Comments"
        SET content = $1
        WHERE id = $2
    `,
      [content, commentId],
    );
  }

  async deleteComment(commentId: string) {
    return await this.dataSource.query(
      `
        DELETE FROM public."Comments"
        WHERE id = $1
    `,
      [commentId],
    );
  }

  async addLike(commentId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Comments"
        SET "likesInfo" = jsonb_set("likesInfo", '{likesCount}',
         (COALESCE("likesInfo"->>'likesCount','0')::int + 1)::text::jsonb)
        WHERE id = $1
    `,
      [commentId],
    );
  }

  async decreaseLike(commentId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Comments"
        SET "likesInfo" = jsonb_set("likesInfo", '{likesCount}',
         (COALESCE("likesInfo"->>'likesCount','0')::int - 1)::text::jsonb)
        WHERE id = $1
    `,
      [commentId],
    );
  }

  async addDislike(commentId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Comments"
        SET "likesInfo" = jsonb_set("likesInfo", '{dislikesCount}',
         (COALESCE("likesInfo"->>'dislikesCount','0')::int + 1)::text::jsonb)
        WHERE id = $1
    `,
      [commentId],
    );
  }

  async decreaseDislike(commentId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Comments"
        SET "likesInfo" = jsonb_set("likesInfo", '{dislikesCount}',
         (COALESCE("likesInfo"->>'dislikesCount','0')::int - 1)::text::jsonb)
        WHERE id = $1
    `,
      [commentId],
    );
  }
}
