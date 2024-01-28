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
import { createPostModel, updatePostModel } from '../../base/types/posts.model';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { PostsRepository } from '../repositories/posts.repository';
import { createCommentModel } from '../../base/types/comments.model';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { Request } from 'express';
import { AuthService } from '../../auth/application/auth.service';
import { ObjectId } from 'mongodb';
import { SendLikes } from '../../base/types/likes.model';
import { SkipThrottle } from '@nestjs/throttler';
import { AccessTokenGuard } from '../../auth/guards/accessToken.guard';
import { CreatePostUseCase } from '../use-cases/createPost.use-case';
import { CreateCommentUseCase } from '../use-cases/createComment.use-case';
import { DoPostLikesUseCase } from '../use-cases/doPostLikes.use-case';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
    private authService: AuthService,
    private createPostUseCase: CreatePostUseCase,
    private createCommentUseCase: CreateCommentUseCase,
    private doPostLikesUseCase: DoPostLikesUseCase,
  ) {}

  @SkipThrottle()
  @Get(':postId/comments')
  @HttpCode(200)
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    const comments = await this.postsQueryRepository.getCommentsByPostId(
      postId,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
    );
    if (!comments) throw new NotFoundException("Post doesn't exists");
    return comments;
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Post(':postId/comments')
  @HttpCode(201)
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() inputData: createCommentModel,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    return await this.createCommentUseCase.createComment(postId, inputData, new ObjectId(userId));
  }

  @SkipThrottle()
  @Get()
  @HttpCode(200)
  async getAllPosts(
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    return await this.postsQueryRepository.getAllPosts(
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
      userId,
    );
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createPostForBlog(@Body() inputData: createPostModel) {
    return await this.createPostUseCase.createPost(inputData);
  }

  @SkipThrottle()
  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id') postId: string, @Req() request: Request) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdForGet(accessToken?.split(' ')[1]);
    return await this.postsQueryRepository.getPostById(postId, userId);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') postId: string, @Body() inputData: updatePostModel) {
    const updatedPost = await this.postsRepository.updatePost(postId, inputData);
    if (!updatedPost) throw new NotFoundException("Post doesn't exists");
    return;
  }

  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async doLikeDislike(
    @Param('postId') postId: string,
    @Body() likeStatus: SendLikes,
    @Req() request: Request,
  ) {
    const accessToken = request.headers.authorization;
    const userId = await this.authService.getUserIdByToken(accessToken?.split(' ')[1]);
    const post = await this.postsQueryRepository.getPostByIdMethod(postId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    return await this.doPostLikesUseCase.doLikes(userId, post, likeStatus.likeStatus);
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string) {
    const deletedPost = await this.postsQueryRepository.deletePostById(postId);
    if (!deletedPost) throw new NotFoundException("Post doesn't exists");
    return;
  }
}
