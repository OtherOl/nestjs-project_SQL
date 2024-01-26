import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/controller/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query-repository';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsController } from './posts/controller/posts.controller';
import { PostsQueryRepository } from './posts/repositories/posts.query-repository';
import { CommentsController } from './comments/controller/comments.controller';
import { CommentsQueryRepository } from './comments/repositories/comments.query-repository';
import { UsersController } from './users/controller/users.controller';
import { UsersQueryRepository } from './users/repositories/users.query-repository';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blogs.entity';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { Post, PostSchema } from './posts/domain/posts.entity';
import { Comment, CommentSchema } from './comments/domain/comments.entity';
import { User, UserSchema } from './users/domain/users.entity';
import { TestingController } from './testing/controller/testing.controller';
import { TestingRepository } from './testing/repositories/testing.repository';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { BasicStrategy } from './auth/strategies/basic.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Security, SecuritySchema } from './securityDevices/domain/security.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth/application/auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './email/emailManager';
import { SecurityController } from './securityDevices/controller/security.controller';
import { SecurityService } from './securityDevices/application/security.service';
import { SecurityRepository } from './securityDevices/repositories/security.repository';
import { SecurityQueryRepository } from './securityDevices/repositories/security.query-repository';
import { Auth, AuthSchema } from './auth/domain/auth.entity';
import { AuthRepository } from './auth/repositories/auth.repository';
import { LikesService } from './likes/application/likes.service';
import { LikesQueryRepository } from './likes/repositories/likes.query-repository';
import { Likes, LikesSchema } from './likes/domain/likes.entity';
import { LikesRepository } from './likes/repositories/likes.repository';
import { TokenGuard } from './auth/guards/token.guard';
import { CustomBlogIdValidation } from './base/middlewares/blogId.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Security.name, schema: SecuritySchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Likes.name, schema: LikesSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'dmitrybackenddev@gmail.com',
          pass: 'tzcjafbdsjqrpmwl',
        },
        service: 'gmail',
      },
    }),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET || '123',
      signOptions: { expiresIn: '10m' },
    }),
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 5 }]),
  ],
  controllers: [
    BlogsController,
    PostsController,
    CommentsController,
    UsersController,
    TestingController,
    AuthController,
    SecurityController,
  ],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    UsersQueryRepository,
    UsersService,
    UsersRepository,
    TestingRepository,
    BasicStrategy,
    AuthService,
    AuthRepository,
    EmailManager,
    SecurityService,
    SecurityRepository,
    SecurityQueryRepository,
    LikesService,
    LikesQueryRepository,
    LikesRepository,
    TokenGuard,
    CustomBlogIdValidation,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
