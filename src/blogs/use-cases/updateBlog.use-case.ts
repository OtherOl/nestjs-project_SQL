import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { createBlogModel } from '../../base/types/blogs.model';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';

@Injectable()
export class UpdateBlogUseCase {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async updateBlog(blogId: string, inputData: createBlogModel) {
    const blog = await this.blogsQueryRepository.getBlogByIdSQL(blogId);
    if (!blog[0]) throw new NotFoundException("Blog doesn't exists");
    return this.blogsRepository.updateBlog(blog[0].id, inputData);
  }
}
