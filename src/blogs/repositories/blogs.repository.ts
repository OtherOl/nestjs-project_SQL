import { Injectable } from '@nestjs/common';
import { blogViewModel, createBlogModel } from '../../base/types/blogs.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectRepository(Blog) private blogsRepository: Repository<Blog>) {}

  async createBlog(blog: blogViewModel) {
    await this.blogsRepository.insert(blog);
    return blog;
  }
  async updateBlog(blogId: string, inputData: createBlogModel) {
    return await this.blogsRepository.update({ id: blogId }, inputData);
  }

  async deleteBlogById(blogId: string) {
    return await this.blogsRepository.delete({ id: blogId });
  }
}
