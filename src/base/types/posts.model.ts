import { ObjectId } from 'mongodb';

export type createPostModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type postModel = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type updatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
