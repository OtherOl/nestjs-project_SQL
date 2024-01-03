import { Injectable } from '@nestjs/common';
import { createBlogModel } from '../../base/types/blogs.model';
import { BlogsRepository } from '../repositories/blogs.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(inputData: createBlogModel) {
    const newBlog = {
      _id: new ObjectId(),
      name: inputData.name,
      description: inputData.description,
      websiteUrl: inputData.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: true,
    };

    return this.blogsRepository.createBlog(newBlog);
  }

  async updateBlog(blogId: string, inputData: createBlogModel) {
    return this.blogsRepository.updateBlog(blogId, inputData);
  }
}
