import { Controller, Get, HttpCode, NotFoundException, Param, Query } from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(200)
  async getAllBlogs(
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return await this.blogsQueryRepository.getAllBlogs(
      query.searchNameTerm || '',
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return await this.postsQueryRepository.getAllPostsByBlogId(
      blogId,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @Get(':id')
  @HttpCode(200)
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.getBlogByIdSQL(id);
    if (!blog[0]) throw new NotFoundException("Blog doesn't exists");
    return blog[0];
  }
}
