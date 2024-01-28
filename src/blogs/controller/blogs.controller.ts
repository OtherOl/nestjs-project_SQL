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
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { createBlogModel } from '../../base/types/blogs.model';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { createBlogPostModel } from '../../base/types/posts.model';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateBlogUseCase } from '../use-cases/createBlog.use-case';
import { CreatePostForBlogUseCase } from '../use-cases/createPostForBlog.use-case';
import { UpdateBlogUseCase } from '../use-cases/updateBlog.use-case';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private authService: AuthService,
    private createBlogUseCase: CreateBlogUseCase,
    private createPostForBlogUseCase: CreatePostForBlogUseCase,
    private updateBlogUseCase: UpdateBlogUseCase,
  ) {}

  @SkipThrottle()
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

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlog(@Body() inputData: createBlogModel) {
    return await this.createBlogUseCase.createBlog(inputData);
  }

  @SkipThrottle()
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
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    const posts = await this.postsQueryRepository.getPostByBlogId(
      blogId,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
    );
    if (!posts) throw new NotFoundException("Blog doesn't exists");
    return posts;
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForBlog(@Param('blogId') blogId: string, @Body() inputData: createBlogPostModel) {
    const newPost = await this.createPostForBlogUseCase.createPostForBlog(blogId, inputData);
    if (!newPost) throw new NotFoundException("Blog doesn't exists");
    return newPost;
  }

  @SkipThrottle()
  @Get(':id')
  @HttpCode(200)
  async getBlogById(@Param('id') blogId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog doesn't exists");
    return blog;
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') blogId: string, @Body() inputData: createBlogModel) {
    const updatedBlog = await this.updateBlogUseCase.updateBlog(blogId, inputData);
    if (!updatedBlog) throw new NotFoundException("Blog doesn't exists");
    return;
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') blogId: string) {
    const deletedBlog = await this.blogsQueryRepository.deleteBlogById(blogId);
    if (!deletedBlog) throw new NotFoundException('Not found');
    return;
  }
}
