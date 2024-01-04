import { Injectable } from '@nestjs/common';
import { blogModel, createBlogModel } from '../../base/types/blogs.model';
import { BlogsRepository } from '../repositories/blogs.repository';
import { ObjectId } from 'mongodb';
import { createBlogPostModel, postModel } from '../../base/types/posts.model';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async createBlog(inputData: createBlogModel) {
    const newBlog = {
      _id: new ObjectId(),
      name: inputData.name,
      description: inputData.description,
      websiteUrl: inputData.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: true,
    };

    return this.blogsRepository.createBlog(newBlog);
  }

  async createPostForBlog(
    blogId: string,
    inputData: createBlogPostModel,
  ): Promise<postModel | null> {
    const blog: blogModel | null =
      await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) return null;

    const newPost: postModel = {
      _id: new ObjectId(),
      title: inputData.title,
      shortDescription: inputData.shortDescription,
      content: inputData.content,
      blogId: blog._id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };

    return this.postsRepository.createPost(newPost);
  }

  async updateBlog(blogId: string, inputData: createBlogModel) {
    return this.blogsRepository.updateBlog(blogId, inputData);
  }
}
