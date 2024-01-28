import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../../posts/domain/posts.entity';
import { Model } from 'mongoose';
import { Blog } from '../../blogs/domain/blogs.entity';
import { Comment, CommentDocument } from '../../comments/domain/comments.entity';
import { User, UserDocument } from '../../users/domain/users.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async clearDB() {
    await this.postModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.userModel.deleteMany({});
    return;
  }
}
