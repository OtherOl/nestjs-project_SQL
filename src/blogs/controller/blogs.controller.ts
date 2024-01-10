import {
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
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { createBlogModel } from '../../base/types/blogs.model';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { createBlogPostModel } from '../../base/types/posts.model';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
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
      query.searchNameTerm,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlog(@Body() inputData: createBlogModel) {
    return await this.blogsService.createBlog(inputData);
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
    const posts = await this.postsQueryRepository.getPostByBlogId(
      blogId,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
    if (!posts) throw new NotFoundException("Blog doesn't exists");
    return posts;
  }

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() inputData: createBlogPostModel,
  ) {
    const newPost = await this.blogsService.createPostForBlog(
      blogId,
      inputData,
    );
    if (!newPost) throw new NotFoundException("Blog doesn't exists");
    return newPost;
  }

  @Get(':id')
  @HttpCode(200)
  async getBlogById(@Param('id') blogId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    return blog;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputData: createBlogModel,
  ) {
    const updatedBlog = await this.blogsService.updateBlog(blogId, inputData);
    if (!updatedBlog) throw new NotFoundException("Blog doesn't exists");
    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const deletedBlog = await this.blogsQueryRepository.deleteBlogById(blogId);
    if (!deletedBlog) throw new NotFoundException('Not found');
    return;
  }
}
