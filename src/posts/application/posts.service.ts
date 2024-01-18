import { Injectable } from '@nestjs/common';
import { createPostModel } from '../../base/types/posts.model';
import { ObjectId } from 'mongodb';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { blogModel } from '../../base/types/blogs.model';
import { commentsModel, createCommentModel } from '../../base/types/comments.model';
import { Post } from '../domain/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async createPost(inputData: createPostModel) {
    const blog: blogModel | null = await this.blogsQueryRepository.getBlogById(inputData.blogId);
    if (!blog) return null;

    const newPost = Post.createNewPost(
      inputData.title,
      inputData.shortDescription,
      inputData.content,
      blog.id,
      blog.name,
    );

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
        userLogin: 'dsa',
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
