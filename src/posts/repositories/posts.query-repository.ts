import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { postModel } from '../../base/types/posts.model';
import { paginationModel } from '../../base/types/pagination.model';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  // async getCommentsByPostId(
  //   searchNameTerm: string,
  //   sortBy: string,
  //   sortDirection: string,
  //   pageNumber: number,
  //   pageSize: number,
  // ) {
  //   const sortQuery: any = {};
  //   sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;
  //
  //   // const filter = { postId: postId };
  //   return sortQuery;
  // }

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
      .find({})
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

    const filter = { blogId: blogId };

    const isExists = await this.blogsQueryRepository.getBlogById(blogId);
    if (!isExists) return null;

    const countPosts: number = await this.postModel.countDocuments(filter);
    const foundedPosts: postModel[] = await this.postModel
      .find(filter)
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
    return this.postModel.findOne({ _id: new ObjectId(postId) });
  }

  async deletePostById(postId: string) {
    const deletedPost = await this.postModel.deleteOne({
      _id: new ObjectId(postId),
    });
    return deletedPost.deletedCount === 1;
  }
}
