import { v4 as uuidv4 } from 'uuid';

export class LikesInfo {
  likesCount: number;

  dislikesCount: number;

  myStatus: string;

  newestLikes: [];
}

export class Post {
  id: string;

  title: string;

  shortDescription: string;

  content: string;

  blogId: string;

  blogName: string;

  createdAt: string;

  extendedLikesInfo: LikesInfo;

  static createNewPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ) {
    const post = new Post();

    post.id = uuidv4();
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
