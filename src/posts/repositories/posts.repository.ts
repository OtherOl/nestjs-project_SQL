import { Injectable } from '@nestjs/common';
import { createBlogPostModel, postModel } from '../../base/types/posts.model';
import { commentsModel } from '../../base/types/comments.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from '../domain/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async createPost(newPost: postModel): Promise<postModel> {
    await this.postsRepository.insert(newPost);
    return newPost;
  }

  async updatePost(postId: string, inputData: createBlogPostModel): Promise<UpdateResult> {
    return await this.postsRepository.update({ id: postId }, inputData);
  }

  async deletePostById(postId: string): Promise<DeleteResult> {
    return await this.postsRepository.delete({ id: postId });
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
