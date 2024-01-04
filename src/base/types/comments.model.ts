import { ObjectId } from 'mongodb';

export type commentsModel = {
  postId: string;
  _id: ObjectId;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
