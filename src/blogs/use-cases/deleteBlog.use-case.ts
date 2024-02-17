import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';

@Injectable()
export class DeleteBlogUseCase {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async deleteBlogById(blogId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog[0]) throw new NotFoundException("Blog doesn't exists");
    return await this.blogsQueryRepository.deleteBlogById(blog[0].id);
  }
}
