import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthBlackList } from '../../auth/domain/auth-black_list.entity';
import { AuthWhiteList } from '../../auth/domain/auth-white_list.entity';
import { Blog } from '../../blogs/domain/blogs.entity';
import { User } from '../../users/domain/users.entity';
import { Security } from '../../securityDevices/domain/security.entity';
import { Post } from '../../posts/domain/posts.entity';
import { Likes } from '../../likes/domain/likes.entity';
import { Comment } from '../../comments/domain/comments.entity';
import { PairQuizGame } from '../../game/pairQuizGame/domain/pairQuizGame.entity';
import { FirstPlayerProgress } from '../../game/pairQuizGame/domain/firstPlayerProgress.entity';
import { SecondPlayerProgress } from '../../game/pairQuizGame/domain/secondPlayerProgress.entity';
import { QuizQuestions } from '../../game/quizQuestions/domain/quizQuestions.entity';
import { Answer } from '../../game/pairQuizGame/domain/answers.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectRepository(AuthBlackList) private authBlackListRepository: Repository<AuthBlackList>,
    @InjectRepository(AuthWhiteList)
    private authWhiteListRepository: Repository<AuthWhiteList>,
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Security) private securityRepository: Repository<Security>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Likes) private likesRepository: Repository<Likes>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(FirstPlayerProgress)
    private firstPlayerProgressRepository: Repository<FirstPlayerProgress>,
    @InjectRepository(SecondPlayerProgress)
    private secondPlayerProgressRepository: Repository<SecondPlayerProgress>,
    @InjectRepository(PairQuizGame) private pairQuizGameRepository: Repository<PairQuizGame>,
    @InjectRepository(QuizQuestions) private quizQuestionsRepository: Repository<QuizQuestions>,
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
  ) {}

  async clearDB() {
    await this.likesRepository.delete({});
    await this.commentsRepository.delete({});
    await this.postsRepository.delete({});
    await this.blogsRepository.delete({});
    await this.securityRepository.delete({});
    await this.usersRepository.delete({});
    await this.authBlackListRepository.delete({});
    await this.authWhiteListRepository.delete({});
    await this.firstPlayerProgressRepository.delete({});
    await this.secondPlayerProgressRepository.delete({});
    await this.pairQuizGameRepository.delete({});
    await this.quizQuestionsRepository.delete({});
    await this.answerRepository.delete({});
    return;
  }
}
