import { Injectable } from '@nestjs/common';
import { blogViewModel } from '../../base/types/blogs.model';
import { paginationModel } from '../../base/types/pagination.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blogs.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectRepository(Blog) private blogsRepository: Repository<Blog>) {}

  async getAllBlogs(
    searchNameTerm: string,
    sortBy: string = 'createdAt',
    sortDirection: 'DESC' | 'ASC' | undefined = 'DESC',
    pageNumber: number,
    pageSize: number,
  ) {
    const countBlogs = await this.blogsRepository
      .createQueryBuilder('b')
      .where('b.name ilike :name', { name: `%${searchNameTerm}%` })
      .getCount();

    const foundedBlogs = await this.blogsRepository
      .createQueryBuilder('b')
      .where('b.name ilike :name', { name: `%${searchNameTerm}%` })
      .orderBy(`b.${sortBy}`, sortDirection)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    const blogs: paginationModel<blogViewModel> = {
      pagesCount: Math.ceil(Number(countBlogs) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countBlogs),
      items: foundedBlogs,
    };
    return blogs;
  }

  async getBlogById(id: string): Promise<blogViewModel | null> {
    return await this.blogsRepository.findOneBy({ id });
  }
}
