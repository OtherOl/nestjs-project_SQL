import { Injectable } from '@nestjs/common';
import { blogViewModel, createBlogModel } from '../../base/types/blogs.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(blog: blogViewModel) {
    await this.dataSource.query(
      `
        INSERT INTO public."Blogs"
        (id, name, description, "websiteUrl", "createdAt", "isMembership")
        VALUES($1, $2, $3, $4, $5, $6)
    `,
      [blog.id, blog.name, blog.description, blog.websiteUrl, blog.createdAt, blog.isMembership],
    );
    return blog;
  }
  async updateBlog(blogId: string, inputData: createBlogModel) {
    return await this.dataSource.query(
      `
        UPDATE public."Blogs"
        SET name = $1, description = $2, "websiteUrl" = $3
        WHERE id = $4
    `,
      [inputData.name, inputData.description, inputData.websiteUrl, blogId],
    );
  }
}
