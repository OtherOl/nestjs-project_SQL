import { IsEnum } from 'class-validator';
import { ObjectId } from 'mongodb';

export type likesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: [];
};

export enum LikesEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class SendLikes {
  @IsEnum(LikesEnum)
  likeStatus: string;
}

export class CommentLikes {
  id: ObjectId;
  type: string;
  userId: ObjectId;
  commentId: ObjectId;
  addedAt: string;
}
