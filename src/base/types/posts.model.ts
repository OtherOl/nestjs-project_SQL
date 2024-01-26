import { ObjectId } from 'mongodb';
import { likesInfo } from './likes.model';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { CustomBlogIdValidation } from '../middlewares/blogId.middleware';

export class createBlogPostModel {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 1000)
  content: string;
}

export class createPostModel {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 1000)
  content: string;

  @IsString()
  @Validate(CustomBlogIdValidation)
  blogId: string;
}

export class postModel {
  id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: likesInfo;
}

export class updatePostModel {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Length(1, 1000)
  content: string;

  @Validate(CustomBlogIdValidation)
  @IsString()
  blogId: string;
}
