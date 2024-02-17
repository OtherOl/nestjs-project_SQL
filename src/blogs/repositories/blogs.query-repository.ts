import { Injectable } from '@nestjs/common';
import { blogViewModel } from '../../base/types/blogs.model';
import { paginationModel } from '../../base/types/pagination.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllBlogs(
    searchNameTerm: string,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    pageNumber: number,
    pageSize: number,
  ) {
    const countBlogs = await this.dataSource.query(
      `
      SELECT COUNT(*)
      FROM public."Blogs"
      WHERE name ILIKE $1
    `,
      [`%${searchNameTerm}%`],
    );

    const foundedBlogs = await this.dataSource.query(
      `
        SELECT *
        FROM public."Blogs"
        WHERE name ILIKE $1
        ORDER BY "${sortBy}" ${sortDirection}
        LIMIT $2 OFFSET $3
    `,
      [`%${searchNameTerm}%`, pageSize, (pageNumber - 1) * pageSize],
    );
    const blogs: paginationModel<blogViewModel> = {
      pagesCount: Math.ceil(Number(countBlogs[0].count) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countBlogs[0].count),
      items: foundedBlogs,
    };
    return blogs;
  }

  async getBlogById(id: string): Promise<blogViewModel | []> {
    return await this.dataSource.query(
      `
        SELECT *
        FROM public."Blogs"
        WHERE id = $1
    `,
      [id],
    );
  }

  async deleteBlogById(blogId: string) {
    return await this.dataSource.query(
      `
        DELETE FROM public."Blogs"
        WHERE id = $1
    `,
      [blogId],
    );
  }
}
