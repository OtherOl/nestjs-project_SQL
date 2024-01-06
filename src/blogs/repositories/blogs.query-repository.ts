import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { blogModel } from '../../base/types/blogs.model';
import { paginationModel } from '../../base/types/pagination.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getAllBlogs(
    searchNameTerm: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
    pageNumber: number,
    pageSize: number,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const filter = { name: RegExp(searchNameTerm, 'i') };
    const countBlogs: number = await this.blogModel.countDocuments(filter);
    const foundedBlogs: blogModel[] = await this.blogModel
      .find(filter, { _id: 0 })
      .sort(sortQuery)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const blogs: paginationModel<blogModel> = {
      pagesCount: Math.ceil(countBlogs / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countBlogs,
      items: foundedBlogs,
    };
    return blogs;
  }

  async getBlogById(blogId: string): Promise<blogModel | null> {
    return this.blogModel.findOne({ id: new ObjectId(blogId) });
  }

  async deleteBlogById(blogId: string) {
    const deletedBlog = await this.blogModel.deleteOne({
      id: new ObjectId(blogId),
    });
    return deletedBlog.deletedCount === 1;
  }
}
