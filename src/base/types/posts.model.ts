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
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: [];
  };
};

export type updatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
