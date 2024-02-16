import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ versionKey: false })
export class Likes {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  postId: string;

  @Prop({ required: false })
  commentId: string;

  @Prop({ required: false })
  login: string;

  static createCommentLike(userId: string, commentId: string, type: string) {
    const commentLike = new Likes();

    commentLike.id = uuidv4();
    commentLike.type = type;
    commentLike.userId = userId;
    commentLike.commentId = commentId;
    commentLike.addedAt = new Date().toISOString();

    return commentLike;
  }

  static createPostLike(userId: string, postId: string, type: string, userLogin: string) {
    const postLike = new Likes();

    postLike.id = uuidv4();
    postLike.type = type;
    postLike.addedAt = new Date().toISOString();
    postLike.userId = userId;
    postLike.postId = postId;
    postLike.login = userLogin;

    return postLike;
  }
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
