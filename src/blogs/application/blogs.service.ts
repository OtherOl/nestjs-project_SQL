import { Injectable } from '@nestjs/common';
import { blogModel, createBlogModel } from '../../base/types/blogs.model';
import { BlogsRepository } from '../repositories/blogs.repository';
import { createBlogPostModel, postModel } from '../../base/types/posts.model';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { Blog } from '../domain/blogs.entity';
import { Post } from '../../posts/domain/posts.entity';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async createBlog(inputData: createBlogModel) {
    const newBlog: blogModel = Blog.createNewBlog(inputData);

    return this.blogsRepository.createBlog(newBlog);
  }

  async createPostForBlog(blogId: string, inputData: createBlogPostModel): Promise<postModel | null> {
    const blog: blogModel | null = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) return null;

    const newPost = Post.createNewPost(
      inputData.title,
      inputData.shortDescription,
      inputData.content,
      blog.id,
      blog.name,
    );

    return this.postsRepository.createPost(newPost);
  }

  async updateBlog(blogId: string, inputData: createBlogModel) {
    return this.blogsRepository.updateBlog(blogId, inputData);
  }
}
