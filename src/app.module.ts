import { Module } from '@nestjs/common';
import { SuperAdminBlogsController } from './blogs/controller/super-admin.blogs.controller';
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
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { TestingController } from './testing/controller/testing.controller';
import { TestingRepository } from './testing/repositories/testing.repository';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { BasicStrategy } from './auth/strategies/basic.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth/application/auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailManager } from './email/emailManager';
import { SecurityController } from './securityDevices/controller/security.controller';
import { SecurityRepository } from './securityDevices/repositories/security.repository';
import { SecurityQueryRepository } from './securityDevices/repositories/security.query-repository';
import { AuthBlackListRepository } from './auth/repositories/auth-black-list-repository.service';
import { LikesService } from './likes/application/likes.service';
import { LikesQueryRepository } from './likes/repositories/likes.query-repository';
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
import { DoPostLikesUseCase } from './posts/use-cases/doPostLikes.use-case';
import { CreateNewPasswordUseCase } from './users/use-cases/createNewPassword.use-case';
import { CreateUserUseCase } from './users/use-cases/createUser.use-case';
import { CreateUserForRegistrationUseCase } from './users/use-cases/createUserForRegistration.use-case';
import { DeleteUserUseCase } from './users/use-cases/deleteUser.use-case';
import { RefreshTokenGuard } from './auth/guards/refreshToken.guard';
import { GetDeviceIdUseCase } from './auth/use-cases/getDeviceId.use-case';
import { AuthWhiteListRepository } from './auth/repositories/auth-white_list.repository';
import { DeleteTokensExceptOneUseCase } from './securityDevices/use-cases/deleteTokensExceptOne.use-case';
import { CreateNewRefreshTokenUseCase } from './auth/use-cases/createNewRefreshToken.use-case';
import { CreateRefreshTokenUseCase } from './auth/use-cases/createRefreshToken.use-case';
import { DecodeRefreshTokenUseCase } from './auth/use-cases/decodeRefreshToken.use-case';
import { CreateSessionUseCase } from './securityDevices/use-cases/createSession.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteBlogUseCase } from './blogs/use-cases/deleteBlog.use-case';
import { DeletePostByBlogIdUseCase } from './blogs/use-cases/deletePostByBlogIdUseCase';
import { UpdatePostByBlogIdUseCase } from './blogs/use-cases/updatePostByBlogId.use-case';
import { BlogsController } from './blogs/controller/blogs.controller';
import { DeleteCommentUseCase } from './comments/use-cases/deleteComment.use-case';
import { Blog } from './blogs/domain/blogs.entity';
import { User } from './users/domain/users.entity';
import { AuthWhiteList } from './auth/domain/auth-white_list.entity';
import { AuthBlackList } from './auth/domain/auth-black_list.entity';
import { Security } from './securityDevices/domain/security.entity';
import { Post } from './posts/domain/posts.entity';
import { Likes } from './likes/domain/likes.entity';
import { Comment } from './comments/domain/comments.entity';
import { GetProfileUseCase } from './auth/use-cases/getProfile-use.case';
import { LogoutUseCase } from './auth/use-cases/logout.use-case';
import { RefreshTokenUseCase } from './auth/use-cases/refreshToken.use-case';
import { DeleteSessionByIdUseCase } from './securityDevices/use-cases/deleteSessionById.use-case';
import { PairQuizGame } from './game/pairQuizGame/domain/pairQuizGame.entity';
import { FirstPlayerProgress } from './game/pairQuizGame/domain/firstPlayerProgress.entity';
import { SecondPlayerProgress } from './game/pairQuizGame/domain/secondPlayerProgress.entity';
import { PairQuizGameController } from './game/pairQuizGame/controller/pairQuizGame.controller';
import { PairQuizGameQueryRepository } from './game/pairQuizGame/repositories/pairQuizGame.query-repository';
import { GetUnfinishedGameUseCase } from './game/pairQuizGame/use-cases/getUnfinishedGame.use-case';
import { CreateOrConnectGameUseCase } from './game/pairQuizGame/use-cases/createOrConnectGame.use-case';
import { PairQuizGameRepository } from './game/pairQuizGame/repositories/pairQuizGame.repository';
import { GetGameByIdUseCase } from './game/pairQuizGame/use-cases/getGameById.use-case';
import { QuizQuestionsController } from './game/quizQuestions/controller/quizQuestions.controller';
import { QuizQuestions } from './game/quizQuestions/domain/quizQuestions.entity';
import { QuizQuestionsQueryRepository } from './game/quizQuestions/repositories/quizQuestions.query-repository';
import { CreateQuizQuestionsUseCase } from './game/quizQuestions/use-cases/createQuizQuestions.use-case';
import { QuizQuestionsRepository } from './game/quizQuestions/repositories/quizQuestions.repository';
import { DeleteQuestionByIdUseCase } from './game/quizQuestions/use-cases/deleteQuestionById.use-case';
import { GetAllQuestionsUseCase } from './game/quizQuestions/use-cases/getAllQuestions.use-case';
import { UpdateQuestionUseCase } from './game/quizQuestions/use-cases/updateQuestion.use-case';
import { UpdateQuestionPublishUseCase } from './game/quizQuestions/use-cases/updateQuestionPublish.use-case';
import { SendAnswersUseCase } from './game/pairQuizGame/use-cases/sendAnswers.use-case';
import { Answer } from './game/pairQuizGame/domain/answers.entity';
import { FirstPlayerSendAnswerUseCase } from './game/pairQuizGame/use-cases/firstPlayerSendAnswer.use-case';
import { SecondPlayerSendAnswerUseCase } from './game/pairQuizGame/use-cases/secondPlayerSendAnswer.use-case';
import { JoinOrCreateGameForMainUseCase } from './game/pairQuizGame/use-cases/joinOrCreateGameForMain.use-case';
import { ChangeStatusToFinishedUseCase } from './game/pairQuizGame/use-cases/changeStatusToFinished.use-case';

const authUseCases = [
  CheckCredentialsUseCase,
  ConfirmEmailUseCase,
  CreateNewRefreshTokenUseCase,
  CreateRefreshTokenUseCase,
  DecodeRefreshTokenUseCase,
  PasswordRecoveryCodeUseCase,
  ResendConfirmationUseCase,
  GetDeviceIdUseCase,
  GetProfileUseCase,
];

const blogsUseCases = [
  CreateBlogUseCase,
  CreatePostForBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  DeletePostByBlogIdUseCase,
  UpdatePostByBlogIdUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
];

const commentsUseCases = [DoLikesUseCase, UpdateCommentUseCase, DeleteCommentUseCase];

const postsUseCases = [CreateCommentUseCase, DoPostLikesUseCase];

const usersUseCases = [
  CreateNewPasswordUseCase,
  CreateUserUseCase,
  CreateUserForRegistrationUseCase,
  DeleteUserUseCase,
];

const securityUseCases = [CreateSessionUseCase, DeleteTokensExceptOneUseCase, DeleteSessionByIdUseCase];

const gameUseCases = [
  GetUnfinishedGameUseCase,
  CreateOrConnectGameUseCase,
  GetGameByIdUseCase,
  SendAnswersUseCase,
  FirstPlayerSendAnswerUseCase,
  SecondPlayerSendAnswerUseCase,
  JoinOrCreateGameForMainUseCase,
  ChangeStatusToFinishedUseCase,
];

const questionUseCases = [
  CreateQuizQuestionsUseCase,
  DeleteQuestionByIdUseCase,
  GetAllQuestionsUseCase,
  UpdateQuestionUseCase,
  UpdateQuestionPublishUseCase,
];

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: PGHOST,
      port: 5432,
      username: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      // logging: ['query'],
    }),
    TypeOrmModule.forFeature([
      Blog,
      User,
      AuthWhiteList,
      AuthBlackList,
      Security,
      Post,
      Likes,
      Comment,
      PairQuizGame,
      FirstPlayerProgress,
      SecondPlayerProgress,
      QuizQuestions,
      Answer,
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
    }),
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 5 }]),
  ],
  controllers: [
    SuperAdminBlogsController,
    BlogsController,
    PostsController,
    CommentsController,
    UsersController,
    TestingController,
    AuthController,
    SecurityController,
    PairQuizGameController,
    QuizQuestionsController,
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
    AuthWhiteListRepository,
    AuthBlackListRepository,
    EmailManager,
    SecurityRepository,
    SecurityQueryRepository,
    LikesService,
    LikesQueryRepository,
    LikesRepository,
    AccessTokenGuard,
    RefreshTokenGuard,
    CustomBlogIdValidation,
    PairQuizGameQueryRepository,
    PairQuizGameRepository,
    QuizQuestionsQueryRepository,
    QuizQuestionsRepository,
    ...authUseCases,
    ...blogsUseCases,
    ...commentsUseCases,
    ...postsUseCases,
    ...usersUseCases,
    ...securityUseCases,
    ...gameUseCases,
    ...questionUseCases,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
