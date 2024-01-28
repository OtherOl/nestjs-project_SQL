import { BadRequestException, Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { PostsRepository } from '../repositories/posts.repository';
import { createPostModel } from '../../base/types/posts.model';
import { blogModel } from '../../base/types/blogs.model';
import { Post } from '../domain/posts.entity';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async createPost(inputData: createPostModel) {
    const blog: blogModel | null = await this.blogsQueryRepository.getBlogById(inputData.blogId);
    if (!blog) throw new BadRequestException([{ message: "Blog doesn't exists", field: 'BlogId' }]);

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
