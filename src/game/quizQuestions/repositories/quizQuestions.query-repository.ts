import { Injectable } from '@nestjs/common';
import { sortDirectionHelper } from '../../../base/helpers/sortDirection.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestions } from '../domain/quizQuestions.entity';
import { Repository } from 'typeorm';
import { GetAllQuestionsUseCase } from '../use-cases/getAllQuestions.use-case';

@Injectable()
export class QuizQuestionsQueryRepository {
  constructor(
    @InjectRepository(QuizQuestions) private quizQuestionsRepository: Repository<QuizQuestions>,
    private publishedStatusHelper: GetAllQuestionsUseCase,
  ) {}

  async getAllQuestions(
    bodySearchTerm: string = '',
    publishedStatus: string = 'all',
    sortBy: string = 'createdAt',
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ) {
    const sortDir = sortDirectionHelper(sortDirection);
    const result = await this.publishedStatusHelper.getAllQuestions(
      publishedStatus,
      bodySearchTerm,
      sortBy,
      sortDir,
      pageNumber,
      pageSize,
    );

    return {
      pagesCount: Math.ceil(result.countedQuestions / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: result.countedQuestions,
      items: result.questions,
    };
  }

  async getQuestionById(id: string): Promise<QuizQuestions | null> {
    return await this.quizQuestionsRepository.findOneBy({ id });
  }
}
