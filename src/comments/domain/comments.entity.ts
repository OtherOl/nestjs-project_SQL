import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ versionKey: false })
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;
}

export const CommentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);

@Schema({ versionKey: false })
export class LikesInfo {
  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({ required: true })
  myStatus: string;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema({ versionKey: false })
export class Comment {
  @Prop({ required: true })
  postId: ObjectId;

  @Prop({ required: true })
  _id: ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true, type: LikesInfoSchema })
  likesInfo: LikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
