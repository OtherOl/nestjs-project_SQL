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
  userId: ObjectId;

  @Prop({ required: true })
  commentId: ObjectId;

  @Prop({ required: true })
  addedAt: string;

  static createLike(userId: ObjectId, commentId: ObjectId, type: string) {
    const like = new Likes();

    like.id = new ObjectId();
    like.type = type;
    like.userId = userId;
    like.commentId = commentId;
    like.addedAt = new Date().toISOString();

    return like;
  }
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
