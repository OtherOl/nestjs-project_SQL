import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { createPostModel, updatePostModel } from '../../base/types/posts.model';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { PostsRepository } from '../repositories/posts.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  @Get(':postId/comments')
  getCommentsByPostId(
    @Param('postId') postId: string,
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    const comment = this.postsQueryRepository.getCommentsByPostId(
      query.searchNameTerm,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
    return comment;
  }

  @Get()
  getAllPosts(
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
    },
  ) {
    return this.postsQueryRepository.getAllPosts(
      query.searchNameTerm,
      query.sortBy,
      query.sortDirection,
      query.pageNumber ? +query.pageNumber : 1,
      query.pageSize ? +query.pageSize : 10,
    );
  }

  @Post()
  createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() inputData: createPostModel,
  ) {
    const newPost = this.postsService.createPost(blogId, inputData);
    if (!newPost) throw new BadRequestException("Blog doesn't exists");
    return newPost;
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsQueryRepository.getPostById(id);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() inputData: updatePostModel) {
    return this.postsRepository.updatePost(id, inputData);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const deletedPost = this.postsService.deletePost(id);
    if (!deletedPost) throw new BadRequestException("Post doesn't exists");
    return;
  }
}
