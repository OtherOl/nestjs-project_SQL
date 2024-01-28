import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { blogModel, createBlogModel } from '../../base/types/blogs.model';
import { Blog } from '../domain/blogs.entity';

@Injectable()
export class CreateBlogUseCase {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(inputData: createBlogModel) {
    const newBlog: blogModel = Blog.createNewBlog(inputData);

    return this.blogsRepository.createBlog(newBlog);
  }
}
