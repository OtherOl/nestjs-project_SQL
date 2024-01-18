import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ versionKey: false, _id: false })
export class LikesInfo {
  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({ required: true })
  myStatus: string;

  @Prop({ required: true })
  newestLikes: [];
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema({ versionKey: false })
export class Post {
  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: ObjectId;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true, type: LikesInfoSchema })
  extendedLikesInfo: LikesInfo;

  static createNewPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
  ) {
    const post = new Post();

    post.id = new ObjectId();
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    post.blogName = blogName;
    post.createdAt = new Date().toISOString();
    post.extendedLikesInfo = { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [] };

    return post;
  }
}
export const PostSchema = SchemaFactory.createForClass(Post);
