import { Injectable, NotFoundException } from '@nestjs/common';
import { createBlogPostModel } from '../../base/types/posts.model';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';

@Injectable()
export class UpdatePostByBlogIdUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async updatePost(blogId: string, postId: string, inputData: createBlogPostModel) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog[0]) throw new NotFoundException("Blog doesn't exists");
    const post = await this.postsQueryRepository.getPostByIdSQL(postId);
    if (!post[0]) throw new NotFoundException("Post doesn't exists");
    const isExists = await this.postsQueryRepository.getPostByBlogId(blogId);
    if (!isExists[0]) throw new NotFoundException("Post doesn't exists");
    return await this.postsRepository.updatePost(postId, inputData);
  }
}
