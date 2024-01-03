import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { blogModel } from '../../base/types/blogs.model';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  getAllBlogs(
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ) {
    const sortQuery: any = {};
    sortQuery[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const filter = { name: RegExp(searchNameTerm, 'i') };
  }

  getBlogById(blogId: string): Promise<blogModel | null> {
    return this.blogModel.findById(blogId, { __v: false });
  }

  deleteBlogById(blogId: string) {}
}
