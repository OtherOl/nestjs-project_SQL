import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { createCommentModel } from '../../base/types/comments.model';
import { LikesEnum } from '../../base/types/likes.model';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ versionKey: false, _id: false })
export class CommentatorInfo {
  @Prop({ required: true })
  userId: ObjectId;

  @Prop({ required: true })
  userLogin: string;
}

export const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema({ versionKey: false, _id: false })
export class LikesInfo {
  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({ required: true })
  myStatus: LikesEnum;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema({ versionKey: false })
export class Comment {
  @Prop({ required: true })
  postId: ObjectId;

  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true, type: LikesInfoSchema })
  likesInfo: LikesInfo;

  static createNewComment(postId: string, content: createCommentModel, userId: ObjectId, userLogin: string) {
    const comment = new Comment();

    comment.postId = new ObjectId(postId);
    comment.id = new ObjectId();
    comment.content = content.content;
    comment.commentatorInfo = { userId, userLogin };
    comment.createdAt = new Date().toISOString();
    comment.likesInfo = { likesCount: 0, dislikesCount: 0, myStatus: LikesEnum.None };

    return comment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
