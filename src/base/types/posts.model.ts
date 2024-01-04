import { ObjectId } from 'mongodb';
import { likesInfo } from './likes.model';

export type createBlogPostModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type createPostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type postModel = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: likesInfo;
};

export type updatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
