import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createPostModel } from '../../base/types/posts.model';
import { ObjectId } from 'mongodb';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { blogModel } from '../../base/types/blogs.model';
import { commentsModel, createCommentModel } from '../../base/types/comments.model';
import { Post } from '../domain/posts.entity';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { Comment } from '../../comments/domain/comments.entity';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
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

  async createComment(postId: string, content: createCommentModel, userId: ObjectId) {
    const post = await this.postsQueryRepository.getPostById(postId);
    const user = await this.usersQueryRepository.getUserById(userId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    if (!user) throw new UnauthorizedException();
    const comment: commentsModel = Comment.createNewComment(postId, content, user.id, user.login);
    return await this.postsRepository.createComment(comment);
  }
}
