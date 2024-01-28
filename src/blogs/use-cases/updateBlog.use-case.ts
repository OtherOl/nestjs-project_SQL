import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { createBlogModel } from '../../base/types/blogs.model';

@Injectable()
export class UpdateBlogUseCase {
  constructor(private blogsRepository: BlogsRepository) {}

  async updateBlog(blogId: string, inputData: createBlogModel) {
    return this.blogsRepository.updateBlog(blogId, inputData);
  }
}
