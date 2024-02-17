import { v4 as uuidv4 } from 'uuid';

export class Likes {
  id: string;

  type: string;

  addedAt: string;

  userId: string;

  postId: string;

  commentId: string;

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
