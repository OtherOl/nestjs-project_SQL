import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { createBlogModel } from '../../base/types/blogs.model';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ versionKey: false })
export class Blog {
  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  isMembership: boolean;

  static createNewBlog(inputData: createBlogModel) {
    const blog = new Blog();

    blog.id = new ObjectId();
    blog.name = inputData.name;
    blog.description = inputData.description;
    blog.websiteUrl = inputData.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;

    return blog;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
