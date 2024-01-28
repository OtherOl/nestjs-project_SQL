import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/controller/blogs.controller';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query-repository';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsController } from './posts/controller/posts.controller';
import { PostsQueryRepository } from './posts/repositories/posts.query-repository';
import { CommentsController } from './comments/controller/comments.controller';
import { CommentsQueryRepository } from './comments/repositories/comments.query-repository';
import { UsersController } from './users/controller/users.controller';
import { UsersQueryRepository } from './users/repositories/users.query-repository';
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
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { CustomBlogIdValidation } from './base/middlewares/blogId.middleware';
import { CheckCredentialsUseCase } from './auth/use-cases/checkCredentials.use-case';
import { ConfirmEmailUseCase } from './auth/use-cases/confirmEmail.use-case';
import { PasswordRecoveryCodeUseCase } from './auth/use-cases/passwordRecoveryCode.use-case';
import { ResendConfirmationUseCase } from './auth/use-cases/resendConfirmation.use-case';
import { CreateBlogUseCase } from './blogs/use-cases/createBlog.use-case';
import { CreatePostForBlogUseCase } from './blogs/use-cases/createPostForBlog.use-case';
import { UpdateBlogUseCase } from './blogs/use-cases/updateBlog.use-case';
import { DoLikesUseCase } from './comments/use-cases/doLikes.use-case';
import { UpdateCommentUseCase } from './comments/use-cases/updateComment.use-case';
import { CreateCommentUseCase } from './posts/use-cases/createComment.use-case';
import { CreatePostUseCase } from './posts/use-cases/createPost.use-case';
import { DoPostLikesUseCase } from './posts/use-cases/doPostLikes.use-case';
import { CreateNewPasswordUseCase } from './users/use-cases/createNewPassword.use-case';
import { CreateUserUseCase } from './users/use-cases/createUser.use-case';
import { CreateUserForRegistrationUseCase } from './users/use-cases/createUserForRegistration.use-case';
import { DeleteUserUseCase } from './users/use-cases/deleteUser.use-case';
import { RefreshTokenGuard } from './auth/guards/refreshToken.guard';
import { GetDeviceIdUseCase } from './auth/use-cases/getDeviceId.use-case';

const authUseCases = [
  CheckCredentialsUseCase,
  ConfirmEmailUseCase,
  PasswordRecoveryCodeUseCase,
  ResendConfirmationUseCase,
  GetDeviceIdUseCase,
];

const blogsUseCases = [CreateBlogUseCase, CreatePostForBlogUseCase, UpdateBlogUseCase];

const commentsUseCases = [DoLikesUseCase, UpdateCommentUseCase];

const postsUseCases = [CreateCommentUseCase, CreatePostUseCase, DoPostLikesUseCase];

const usersUseCases = [
  CreateNewPasswordUseCase,
  CreateUserUseCase,
  CreateUserForRegistrationUseCase,
  DeleteUserUseCase,
];

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
      signOptions: { expiresIn: '10s' },
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
    BlogsQueryRepository,
    BlogsRepository,
    PostsRepository,
    PostsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    UsersQueryRepository,
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
    AccessTokenGuard,
    RefreshTokenGuard,
    CustomBlogIdValidation,
    ...authUseCases,
    ...blogsUseCases,
    ...commentsUseCases,
    ...postsUseCases,
    ...usersUseCases,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
