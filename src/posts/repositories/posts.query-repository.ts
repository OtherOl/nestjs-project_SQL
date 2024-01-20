import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { postModel } from '../../base/types/posts.model';
import { paginationModel } from '../../base/types/pagination.model';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { ObjectId } from 'mongodb';
import { commentsModel } from '../../base/types/comments.model';
import { Comment, CommentDocument } from '../../comments/domain/comments.entity';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private blogsQueryRepository: BlogsQueryRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async getCommentsByPostId(
    postId: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
    pageNumber: number,
    pageSize: number,
    userId: string,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const filter = { postId: new ObjectId(postId) };

    const isExists = await this.postModel.findOne({ id: new ObjectId(postId) });
    if (!isExists) return null;
    const countComments: number = await this.commentModel.countDocuments(filter);
    const foundedComments: commentsModel[] = await this.commentModel
      .find(filter, { _id: 0, postId: 0 })
      .sort(sortQuery)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const like = await this.likesQueryRepository.getLikeByUserId(new ObjectId(userId));
    const commentsQuery: any[] = foundedComments.map((comment) => {
      let likeStatus = '';
      const status = like.find((like) => like.commentId.equals(comment.id));
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
      pagesCount: Math.ceil(countComments / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countComments,
      items: commentsQuery,
    };
    return posts;
  }

  async getAllPosts(
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
    pageNumber: number,
    pageSize: number,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const countPosts: number = await this.postModel.countDocuments();
    const foundedPosts: postModel[] = await this.postModel
      .find({}, { _id: 0 })
      .sort(sortQuery)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const posts: paginationModel<postModel> = {
      pagesCount: Math.ceil(countPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countPosts,
      items: foundedPosts,
    };
    return posts;
  }

  async getPostByBlogId(
    blogId: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
    pageNumber: number,
    pageSize: number,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const filter = { blogId: new ObjectId(blogId) };

    const isExists = await this.blogsQueryRepository.getBlogById(blogId);
    if (!isExists) return null;

    const countPosts: number = await this.postModel.countDocuments(filter);
    const foundedPosts: postModel[] = await this.postModel
      .find(filter, { _id: 0 })
      .sort(sortQuery)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const posts: paginationModel<postModel> = {
      pagesCount: Math.ceil(countPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countPosts,
      items: foundedPosts,
    };
    return posts;
  }

  async getPostById(postId: string): Promise<postModel | null> {
    return this.postModel.findOne({ id: new ObjectId(postId) }, { _id: 0 });
  }

  async deletePostById(postId: string) {
    const deletedPost = await this.postModel.deleteOne({
      id: new ObjectId(postId),
    });
    return deletedPost.deletedCount === 1;
  }
}
