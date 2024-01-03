import { Injectable } from '@nestjs/common';
import { postModel, updatePostModel } from '../../base/types/posts.model';

@Injectable()
export class PostsRepository {
  createPost(newPost: postModel) {
    return newPost;
  }

  updatePost(id: string, inputData: updatePostModel) {
    return inputData;
  }

  deletePost(id: string) {
    return id;
  }
}
