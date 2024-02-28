import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthBlackList } from '../../auth/domain/auth-black_list.entity';
import { AuthWhiteList } from '../../auth/domain/auth-white_list.entity';
import { Blog } from '../../blogs/domain/blogs.entity';
import { User } from '../../users/domain/users.entity';
import { Security } from '../../securityDevices/domain/security.entity';
import { Post } from '../../posts/domain/posts.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(AuthBlackList) private authBlackListRepository: Repository<AuthBlackList>,
    @InjectRepository(AuthWhiteList)
    private authWhiteListRepository: Repository<AuthWhiteList>,
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Security) private securityRepository: Repository<Security>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async clearDB() {
    await this.postsRepository.delete({});
    await this.blogsRepository.delete({});
    await this.dataSource.query(`
        DELETE FROM public."Comments"
    `);
    await this.securityRepository.delete({});
    await this.usersRepository.delete({});
    await this.authBlackListRepository.delete({});
    await this.authWhiteListRepository.delete({});
    await this.dataSource.query(`
        DELETE FROM public."Likes"
    `);
    return;
  }
}
