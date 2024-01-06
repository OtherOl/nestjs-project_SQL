import { ObjectId } from 'mongodb';

export type createBlogModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type blogModel = {
  id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
