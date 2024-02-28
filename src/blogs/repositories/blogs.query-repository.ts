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
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<paginationModel<blogViewModel>> {
    let sortDir: 'ASC' | 'DESC';
    if (!sortDirection || sortDirection === 'desc' || sortDirection === 'DESC') {
      sortDir = 'DESC';
    } else {
      sortDir = 'ASC';
    }
    const countBlogs = await this.blogsRepository
      .createQueryBuilder('b')
      .where('b.name ilike :name', { name: `%${searchNameTerm}%` })
      .getCount();

    const foundedBlogs = await this.blogsRepository
      .createQueryBuilder('b')
      .where('b.name ilike :name', { name: `%${searchNameTerm}%` })
      .orderBy(`b.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getMany();

    return {
      pagesCount: Math.ceil(Number(countBlogs) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: Number(countBlogs),
      items: foundedBlogs,
    };
  }

  async getBlogById(id: string): Promise<blogViewModel | null> {
    return await this.blogsRepository.findOneBy({ id });
  }
}
