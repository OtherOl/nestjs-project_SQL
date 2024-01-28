import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { createBlogPostModel, postModel } from '../../base/types/posts.model';
import { blogModel } from '../../base/types/blogs.model';
import { Post } from '../../posts/domain/posts.entity';

@Injectable()
export class CreatePostForBlogUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

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
}
