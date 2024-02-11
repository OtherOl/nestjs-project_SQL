import { ObjectId } from 'mongodb';
import { likesInfo } from './likes.model';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { CustomBlogIdValidation } from '../middlewares/blogId.middleware';
import { applyDecorators } from '@nestjs/common';

const Trim = () => Transform(({ value }: TransformFnParams) => value?.trim());

function IsNotEmptyCustom() {
  return applyDecorators(IsString(), Trim(), IsNotEmpty());
}

export class createBlogPostModel {
  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 1000)
  content: string;
}

export class createPostModel {
  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
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

export class postModelSQL {
  id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: likesInfo;
}

export class updatePostModel {
  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @IsNotEmptyCustom()
  @IsString()
  @Length(1, 1000)
  content: string;

  @Validate(CustomBlogIdValidation)
  @IsString()
  blogId: string;
}
