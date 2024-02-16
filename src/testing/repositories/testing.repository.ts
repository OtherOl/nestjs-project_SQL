import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async clearDB() {
    await this.dataSource.query(`
        DELETE FROM public."Posts"
    `);
    await this.dataSource.query(`
        DELETE FROM public."Blogs"
    `);
    await this.dataSource.query(`
        DELETE FROM public."Comments"
    `);
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
    await this.dataSource.query(`
        DELETE FROM public."Likes"
    `);
    return;
  }
}
