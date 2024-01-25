import { ObjectId } from 'mongodb';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class createBlogModel {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @Length(1, 15)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}

export class blogModel {
  id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
