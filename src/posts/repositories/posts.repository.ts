import { Injectable } from '@nestjs/common';
import { createBlogPostModel, postModelSQL } from '../../base/types/posts.model';
import { commentsModel } from '../../base/types/comments.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPostSQL(newPost: postModelSQL) {
    const id = uuidv4();
    await this.dataSource.query(
      `
        INSERT INTO public."Posts"(
        id, title, "shortDescription", content, "blogId", "blogName", "createdAt", "extendedLikesInfo")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        id,
        newPost.title,
        newPost.shortDescription,
        newPost.content,
        newPost.blogId,
        newPost.blogName,
        newPost.createdAt,
        {
          likesCount: newPost.extendedLikesInfo.likesCount,
          dislikesCount: newPost.extendedLikesInfo.dislikesCount,
          myStatus: newPost.extendedLikesInfo.myStatus,
          newestLikes: newPost.extendedLikesInfo.newestLikes,
        },
      ],
    );

    return {
      id: id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: newPost.extendedLikesInfo.likesCount,
        dislikesCount: newPost.extendedLikesInfo.dislikesCount,
        myStatus: newPost.extendedLikesInfo.myStatus,
        newestLikes: newPost.extendedLikesInfo.newestLikes,
      },
    };
  }

  async updatePostSQL(postId: string, inputData: createBlogPostModel) {
    return await this.dataSource.query(
      `
        UPDATE public."Posts"
        SET title = $1, "shortDescription" = $2, content = $3
        WHERE id = $4
    `,
      [inputData.title, inputData.shortDescription, inputData.content, postId],
    );
  }

  async createComment(newComment: commentsModel) {
    await this.dataSource.query(
      `
        INSERT INTO public."Comments"(
            id, "postId", content, "commentatorInfo", "createdAt", "likesInfo")
            VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [
        newComment.id,
        newComment.postId,
        newComment.content,
        { userId: newComment.commentatorInfo.userId, userLogin: newComment.commentatorInfo.userLogin },
        newComment.createdAt,
        {
          likesCount: newComment.likesInfo.likesCount,
          dislikesCount: newComment.likesInfo.dislikesCount,
          myStatus: newComment.likesInfo.myStatus,
        },
      ],
    );
    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: newComment.likesInfo.likesCount,
        dislikesCount: newComment.likesInfo.dislikesCount,
        myStatus: newComment.likesInfo.myStatus,
      },
    };
  }

  async deletePostById(postId: string) {
    return await this.dataSource.query(
      `
        DELETE FROM public."Posts"
        WHERE id = $1
    `,
      [postId],
    );
  }

  async addLike(postId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Posts"
        SET "extendedLikesInfo" = jsonb_set("extendedLikesInfo", '{likesCount}',
        (COALESCE("extendedLikesInfo"->>'likesCount','0')::int + 1)::text::jsonb)
        WHERE id = $1
    `,
      [postId],
    );
  }

  async decreaseLike(postId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Posts"
        SET "extendedLikesInfo" = jsonb_set("extendedLikesInfo", '{likesCount}',
        (COALESCE("extendedLikesInfo"->>'likesCount','0')::int - 1)::text::jsonb)
        WHERE id = $1
    `,
      [postId],
    );
  }

  async addDislike(postId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Posts"
        SET "extendedLikesInfo" = jsonb_set("extendedLikesInfo", '{dislikesCount}',
        (COALESCE("extendedLikesInfo"->>'dislikesCount','0')::int + 1)::text::jsonb)
        WHERE id = $1
    `,
      [postId],
    );
  }

  async decreaseDislike(postId: string) {
    return await this.dataSource.query(
      `
        UPDATE public."Posts"
        SET "extendedLikesInfo" = jsonb_set("extendedLikesInfo", '{dislikesCount}',
        (COALESCE("extendedLikesInfo"->>'dislikesCount','0')::int - 1)::text::jsonb)
        WHERE id = $1
    `,
      [postId],
    );
  }
}
