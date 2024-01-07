import { Injectable } from '@nestjs/common';
import { postModel, updatePostModel } from '../../base/types/posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { commentsModel } from '../../base/types/comments.model';
import {
  Comment,
  CommentDocument,
} from '../../comments/domain/comments.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async createPost(newPost: postModel): Promise<postModel | null> {
    await this.postModel.create(newPost);
    return newPost;
  }

  async updatePost(postId: string, inputData: updatePostModel) {
    const updatedPost = await this.postModel.updateOne(
      { id: new ObjectId(postId) },
      { $set: { ...inputData } },
    );
    return updatedPost.modifiedCount === 1;
  }

  async createComment(newComment: commentsModel) {
    await this.commentModel.create(newComment);
    return newComment;
  }
}
