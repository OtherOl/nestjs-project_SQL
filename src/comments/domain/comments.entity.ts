import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ versionKey: false })
export class Comment {
  @Prop({ required: true })
  postId: ObjectId;

  @Prop({ required: true })
  _id: ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
