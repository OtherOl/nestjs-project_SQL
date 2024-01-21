import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikesDocument = HydratedDocument<Likes>;

@Schema({ versionKey: false })
export class Likes {
  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  userId: ObjectId;

  @Prop({ required: false })
  postId: ObjectId;

  @Prop({ required: false })
  commentId: ObjectId;

  @Prop({ required: false })
  login: string;

  static createCommentLike(userId: ObjectId, commentId: ObjectId, type: string) {
    const commentLike = new Likes();

    commentLike.id = new ObjectId();
    commentLike.type = type;
    commentLike.userId = userId;
    commentLike.commentId = commentId;
    commentLike.addedAt = new Date().toISOString();

    return commentLike;
  }

  static createPostLike(userId: ObjectId, postId: ObjectId, type: string, userLogin: string) {
    const postLike = new Likes();

    postLike.id = new ObjectId();
    postLike.type = type;
    postLike.addedAt = new Date().toISOString();
    postLike.userId = userId;
    postLike.postId = postId;
    postLike.login = userLogin;

    return postLike;
  }
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
