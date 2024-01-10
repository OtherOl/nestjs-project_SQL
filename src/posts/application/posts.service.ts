import { Injectable } from '@nestjs/common';
import { createPostModel, postModel } from '../../base/types/posts.model';
import { ObjectId } from 'mongodb';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { blogModel } from '../../base/types/blogs.model';
import {
  commentsModel,
  createCommentModel,
} from '../../base/types/comments.model';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async createPost(inputData: createPostModel) {
    const blog: blogModel | null = await this.blogsQueryRepository.getBlogById(
      inputData.blogId,
    );
    if (!blog) return null;

    const newPost: postModel = {
      id: new ObjectId(),
      title: inputData.title,
      shortDescription: inputData.shortDescription,
      content: inputData.content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };

    return this.postsRepository.createPost(newPost);
  }

  async createComment(postId: string, content: createCommentModel) {
    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) return null;
    const comment: commentsModel = {
      postId: new ObjectId(postId),
      id: new ObjectId(),
      content: content.content,
      commentatorInfo: {
        userId: 'dsa',
        userLogin: 'dsada',
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
    return await this.postsRepository.createComment(comment);
  }
}
