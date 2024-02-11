import { Injectable } from '@nestjs/common';
import { createBlogPostModel, postModelSQL, updatePostModel } from '../../base/types/posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { commentsModel } from '../../base/types/comments.model';
import { Comment, CommentDocument } from '../../comments/domain/comments.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createPostSQL(newPost: postModelSQL) {
    const id = uuidv4();
    await this.dataSource.query(
      `
        INSERT INTO public."Posts"(
        id, title, "shortDescription", content, "blogId", "blogName", "createdAt", "extendedLikesInfo")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        id,
        newPost.title,
        newPost.shortDescription,
        newPost.content,
        newPost.blogId,
        newPost.blogName,
        newPost.createdAt,
        {
          likesCount: newPost.extendedLikesInfo.likesCount,
          dislikesCount: newPost.extendedLikesInfo.dislikesCount,
          myStatus: newPost.extendedLikesInfo.myStatus,
          newestLikes: newPost.extendedLikesInfo.newestLikes,
        },
      ],
    );

    return {
      id: id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: [],
    };
  }

  async updatePost(postId: string, inputData: updatePostModel) {
    const updatedPost = await this.postModel.updateOne(
      { id: new ObjectId(postId) },
      { $set: { ...inputData } },
    );
    return updatedPost.modifiedCount === 1;
  }

  async updatePostSQL(postId: string, inputData: createBlogPostModel) {
    return await this.dataSource.query(
      `
        UPDATE public."Posts"
        SET title = $1, shortDescription = $2, content = $3
        WHERE id = $4
    `,
      [inputData.title, inputData.shortDescription, inputData.content, postId],
    );
  }

  async createComment(newComment: commentsModel) {
    await this.commentModel.create(newComment);
    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: newComment.likesInfo.likesCount,
        dislikesCount: newComment.likesInfo.dislikesCount,
        myStatus: newComment.likesInfo.myStatus,
      },
    };
  }

  async deletePostById(postId: string) {
    return await this.dataSource.query(
      `
        DELETE FROM public."Posts"
        WHERE id = $1
    `,
      [postId],
    );
  }

  async addLike(postId: ObjectId) {
    return this.postModel.updateOne({ id: postId }, { $inc: { 'extendedLikesInfo.likesCount': +1 } });
  }

  async decreaseLike(postId: ObjectId) {
    return this.postModel.updateOne({ id: postId }, { $inc: { 'extendedLikesInfo.likesCount': -1 } });
  }

  async addDislike(postId: ObjectId) {
    return this.postModel.updateOne({ id: postId }, { $inc: { 'extendedLikesInfo.dislikesCount': +1 } });
  }

  async decreaseDislike(postId: ObjectId) {
    return this.postModel.updateOne({ id: postId }, { $inc: { 'extendedLikesInfo.dislikesCount': -1 } });
  }
}
