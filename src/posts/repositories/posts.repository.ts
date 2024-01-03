import { Injectable } from '@nestjs/common';
import { postModel, updatePostModel } from '../../base/types/posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async createPost(newPost: postModel) {
    await this.postModel.create(newPost);
    return newPost;
  }

  async updatePost(postId: string, inputData: updatePostModel) {
    const updatedPost = await this.postModel.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { ...inputData } },
    );
    return updatedPost.modifiedCount === 1;
  }
}
