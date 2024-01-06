import { Injectable } from '@nestjs/common';
import { blogModel, createBlogModel } from '../../base/types/blogs.model';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(blog: blogModel): Promise<blogModel> {
    await this.blogModel.create(blog);
    return blog;
  }
  async updateBlog(blogId: string, inputData: createBlogModel) {
    const updatedBlog = await this.blogModel.updateOne(
      { id: new ObjectId(blogId) },
      {
        $set: {
          name: inputData.name,
          description: inputData.description,
          websiteUrl: inputData.websiteUrl,
        },
      },
    );
    return updatedBlog.modifiedCount === 1;
  }
}
