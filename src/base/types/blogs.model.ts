import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

const Trim = () => Transform(({ value }: TransformFnParams) => value?.trim());

function IsNotEmptyCustom() {
  return applyDecorators(IsString(), Trim(), IsNotEmpty());
}

export class createBlogModel {
  @IsNotEmpty()
  @IsString()
  @IsNotEmptyCustom()
  @Length(1, 15)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}

export class blogViewModelSQL {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
