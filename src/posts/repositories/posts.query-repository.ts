import { Injectable, NotFoundException } from '@nestjs/common';
import { postModel } from '../../base/types/posts.model';
import { paginationModel } from '../../base/types/pagination.model';
import { commentsModel } from '../../base/types/comments.model';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async getCommentsByPostId(
    postId: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    userId: string,
  ) {
    const countComments = await this.dataSource.query(
      `
        SELECT COUNT(*)
        FROM public."Comments"
        WHERE "postId" = $1
    `,
      [postId],
    );
    if (Number(countComments[0].count) === 0)
      throw new NotFoundException("Comments with this id aren't exists");

    const foundedComments = await this.dataSource.query(
      `
        SELECT *
        FROM public."Comments"
        WHERE "postId" = $1
        ORDER BY "${sortBy}" ${sortDirection}
        LIMIT $2 OFFSET $3
    `,
      [postId, pageSize, (pageNumber - 1) * pageSize],
    );

    const like = await this.likesQueryRepository.getLikeByUserId(userId);
    const commentsQuery: any[] = foundedComments.map((comment) => {
      let likeStatus: string;
      const status = like.find((like) => like.commentId === comment.id);
      if (!status) {
        likeStatus = 'None';
      } else {
        likeStatus = status.type;
      }

      return {
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: likeStatus,
        },
      };
    });

    const posts: paginationModel<commentsModel> = {
      pagesCount: Math.ceil(Number(countComments[0].count) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countComments[0].count),
      items: commentsQuery,
    };
    return posts;
  }

  async getAllPosts(
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    userId: string,
  ) {
    const countPosts = await this.dataSource.query(`
        SELECT COUNT(*)
        FROM public."Posts"
    `);

    const foundedPosts = await this.dataSource.query(
      `
        SELECT *
        FROM public."Posts"
        ORDER BY "${sortBy}" ${sortDirection}
        LIMIT $1 OFFSET $2
    `,
      [pageSize, (pageNumber - 1) * pageSize],
    );
    const like = await this.likesQueryRepository.getLikeByUserId(userId);
    const likes: any[] = await this.likesQueryRepository.getNewestLikes('Like');

    const postsQuery: any[] = foundedPosts.map((post) => {
      let likeStatus: string;
      const status = like.find((l) => l.postId === post.id);
      if (!status) {
        likeStatus = 'None';
      } else {
        likeStatus = status.type;
      }
      const newestLikes = likes
        .filter((l) => l.postId === post.id)
        .map((like) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { postId, id, type, ...rest } = like;
          return rest;
        })
        .slice(0, 3);

      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: likeStatus,
          newestLikes: newestLikes,
        },
      };
    });
    const posts: paginationModel<postModel> = {
      pagesCount: Math.ceil(Number(countPosts[0].count) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countPosts[0].count),
      items: postsQuery,
    };
    return posts;
  }

  async getAllPostsByBlogId(
    blogId: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
    userId: string,
  ) {
    const countPosts = await this.dataSource.query(
      `
        SELECT COUNT(*)
        FROM public."Posts"
        WHERE "blogId" = $1
    `,
      [blogId],
    );

    if (Number(countPosts[0].count) === 0) throw new NotFoundException("Blog doesn't exists");

    const foundedPosts = await this.dataSource.query(
      `
        SELECT *
        FROM public."Posts"
        WHERE "blogId" = $1
        ORDER BY "${sortBy}" ${sortDirection}
        LIMIT $2 OFFSET $3
    `,
      [blogId, pageSize, (pageNumber - 1) * pageSize],
    );
    const postLike = await this.likesQueryRepository.getLikeByUserId(userId);
    const likes: any[] = await this.likesQueryRepository.getNewestLikes('Like');

    const postsQuery: any[] = foundedPosts.map((post) => {
      let likeStatus: string;
      const postStatus = postLike.find((l) => l.postId === post.id);

      if (!postStatus) {
        likeStatus = 'None';
      } else {
        likeStatus = postStatus.type;
      }
      const newestPostLikes = likes
        .filter((l) => l.postId.equals(post.id))
        .map((like) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { postId, id, type, ...rest } = like;
          return rest;
        })
        .slice(0, 3);

      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: likeStatus,
          newestLikes: newestPostLikes,
        },
      };
    });

    const posts: paginationModel<postModel> = {
      pagesCount: Math.ceil(Number(countPosts[0].count) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countPosts[0].count),
      items: postsQuery,
    };
    return posts;
  }

  async getPostByBlogId(blogId: string) {
    return await this.dataSource.query(
      `
        SELECT *
        FROM public."Posts"
        WHERE "blogId" = $1
    `,
      [blogId],
    );
  }

  async getPostByIdSQL(postId: string) {
    return await this.dataSource.query(
      `
        SELECT *
        FROM public."Posts"
        WHERE id = $1
    `,
      [postId],
    );
  }

  async getPostById(postId: string, userId: string) {
    let likeStatus: string;
    const post = await this.dataSource.query(
      `
        SELECT *
        FROM public."Posts"
        WHERE id = $1
    `,
      [postId],
    );
    const like = await this.likesQueryRepository.getLikeByPostId(userId, postId);
    if (!post[0]) throw new NotFoundException("Post doesn't exists");
    like ? (likeStatus = like.type) : (likeStatus = 'None');
    const newestLikes = await this.likesQueryRepository.getNewestLikeForCurrentPost(postId, 'Like');

    return {
      id: post[0].id,
      title: post[0].title,
      shortDescription: post[0].shortDescription,
      content: post[0].content,
      blogId: post[0].blogId,
      blogName: post[0].blogName,
      createdAt: post[0].createdAt,
      extendedLikesInfo: {
        likesCount: post[0].extendedLikesInfo.likesCount,
        dislikesCount: post[0].extendedLikesInfo.dislikesCount,
        myStatus: likeStatus,
        newestLikes: newestLikes,
      },
    };
  }
}
