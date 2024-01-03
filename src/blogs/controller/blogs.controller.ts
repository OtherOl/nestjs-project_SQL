import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { createBlogModel } from '../../base/types/blogs.model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  getAllBlogs(
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return this.blogsQueryRepository.getAllBlogs(
      query.searchNameTerm,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @Post()
  createBlog(@Body() inputData: createBlogModel) {
    return this.blogsService.createBlog(inputData);
  }

  @Get(':id')
  getBlogById(@Param('id') blogId: string) {
    return this.blogsQueryRepository.getBlogById(blogId);
  }

  @Put(':id')
  updateBlog(@Param('id') blogId: string, @Body() inputData: createBlogModel) {
    return this.blogsService.updateBlog(blogId, inputData);
  }

  @Delete(':id')
  deleteBlogById(@Param('id') blogId: string) {
    return this.blogsQueryRepository.deleteBlogById(blogId);
  }
}
