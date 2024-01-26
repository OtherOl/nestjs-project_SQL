import { ObjectId } from 'mongodb';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class createCommentModel {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(20, 300)
  content: string;
}

export class commentsModel {
  postId: ObjectId;
  id: ObjectId;
  content: string;
  commentatorInfo: {
    userId: ObjectId;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
}

export class CommentViewModel {
  id: ObjectId;
  content: string;
  commentatorInfo: {
    userId: ObjectId;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
}
