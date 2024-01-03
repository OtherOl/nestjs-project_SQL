import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { createBlogModel } from '../../base/types/blogs.model';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { createPostModel } from '../../base/types/posts.model';
import { PostsService } from '../../posts/application/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
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
    return this.blogsQueryRepository.getAllBlogs(
      query.searchNameTerm,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @Post()
  async createBlog(@Body() inputData: createBlogModel) {
    return this.blogsService.createBlog(inputData);
  }

  @Get(':blogId/posts')
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
    return this.postsQueryRepository.getPostByBlogId(
      blogId,
      query.searchNameTerm,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() inputData: createPostModel,
  ) {
    const newPost = this.postsService.createPost(blogId, inputData);
    if (!newPost) throw new BadRequestException("Blog doesn't exists");
    return newPost;
  }

  @Get(':id')
  async getBlogById(@Param('id') blogId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    return blog;
  }

  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputData: createBlogModel,
  ) {
    const updatedBlog = await this.blogsService.updateBlog(blogId, inputData);
    if (!updatedBlog) throw new BadRequestException('Incorrect inputdata');
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const deletedBlog = await this.blogsQueryRepository.deleteBlogById(blogId);
    if (!deletedBlog) throw new NotFoundException('Not found');
    return;
  }
}
