import { Injectable } from '@nestjs/common';
import { createPostModel, postModel } from '../../base/types/posts.model';
import { ObjectId } from 'mongodb';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryRepository } from '../repositories/posts.query-repository';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  createPost(blogId: string, inputData: createPostModel) {
    //const blog
    const newPost: postModel = {
      _id: new ObjectId(),
      title: inputData.title,
      shortDescription: inputData.shortDescription,
      content: inputData.content,
      blogId: blogId, //fix
      blogName: blogId, //fix
      createdAt: new Date().toISOString(),
    };
    this.postsRepository.createPost(newPost);
    return newPost;
  }

  deletePost(id: string) {
    // const post = this.postsQueryRepository.getPostById(id);
    // if (!post) return false;

    return this.postsRepository.deletePost(id);
  }
}
