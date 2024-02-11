import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../comments/domain/comments.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async clearDB() {
    await this.dataSource.query(`
        DELETE FROM public."Posts"
    `);
    await this.dataSource.query(`
        DELETE FROM public."Blogs"
    `);
    await this.commentModel.deleteMany({});
    await this.dataSource.query(`
      DELETE FROM public."Users"
    `);
    await this.dataSource.query(`
      DELETE FROM public."Sessions"
    `);
    await this.dataSource.query(`
      DELETE FROM public."AuthBlackList"
    `);
    await this.dataSource.query(`
      DELETE FROM public."AuthWhiteList"
    `);
    return;
  }
}
