import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';

@Injectable()
export class DeletePostByBlogIdUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async deletePost(blogId: string, postId: string) {
    const post = await this.postsQueryRepository.getPostByIdSQL(postId);
    if (!post[0]) throw new NotFoundException("Post doesn't exists");
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog[0]) throw new NotFoundException("Blog doesn't exists");
    const isExists = await this.postsQueryRepository.getPostByBlogId(blogId);
    if (!isExists[0]) throw new NotFoundException("Post doesn't exists");
    return await this.postsRepository.deletePostById(postId);
  }
}
