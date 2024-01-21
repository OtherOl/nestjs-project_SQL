import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createPostModel, postModel } from '../../base/types/posts.model';
import { ObjectId } from 'mongodb';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';
import { blogModel } from '../../base/types/blogs.model';
import { commentsModel, createCommentModel } from '../../base/types/comments.model';
import { Post } from '../domain/posts.entity';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { Comment } from '../../comments/domain/comments.entity';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { LikesService } from '../../likes/application/likes.service';
import { LikesRepository } from '../../likes/repositories/likes.repository';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private likesQueryRepository: LikesQueryRepository,
    private likesService: LikesService,
    private likesRepository: LikesRepository,
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
    const post = await this.postsQueryRepository.getPostByIdMethod(postId);
    const user = await this.usersQueryRepository.getUserById(userId);
    if (!post) throw new NotFoundException("Post doesn't exists");
    if (!user) throw new UnauthorizedException();
    const comment: commentsModel = Comment.createNewComment(postId, content, user.id, user.login);
    return await this.postsRepository.createComment(comment);
  }

  async doLikes(userId: ObjectId, post: postModel, likeStatus: string) {
    const like = await this.likesQueryRepository.getLikeByPostId(new ObjectId(userId), post.id);
    const user = await this.usersQueryRepository.getUserById(new ObjectId(userId));
    if (likeStatus === 'Like') {
      if (!like) {
        await this.likesService.createNewPostLike(new ObjectId(userId), post.id, 'Like', user!.login);
        await this.postsRepository.addLike(post.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.postsRepository.decreaseDislike(post.id);
        await this.postsRepository.addLike(post.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Like');
        await this.postsRepository.addLike(post.id);
        return;
      }
    }
    if (likeStatus === 'Dislike') {
      if (!like) {
        await this.likesService.createNewPostLike(new ObjectId(userId), post.id, 'Dislike', user!.login);
        await this.postsRepository.addDislike(post.id);
        return;
      }
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.postsRepository.decreaseLike(post.id);
        await this.postsRepository.addDislike(post.id);
        return;
      }
      if (like.type === 'None') {
        await this.likesRepository.updateLike(like.id, 'Dislike');
        await this.postsRepository.addDislike(post.id);
        return;
      }
    }
    if (likeStatus === 'None') {
      if (!like) return;
      if (like.type === 'Like') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.postsRepository.decreaseLike(post.id);
        return;
      }
      if (like.type === 'Dislike') {
        await this.likesRepository.updateLike(like.id, 'None');
        await this.postsRepository.decreaseDislike(post.id);
        return;
      }
    }
  }
}
