import { Injectable } from '@nestjs/common';
import { QuizQuestionsRepository } from '../repositories/quizQuestions.repository';

@Injectable()
export class UpdateQuestionPublishUseCase {
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}

  async updateQuestion(id: string, published: boolean) {
    return await this.quizQuestionsRepository.updateQuestionPublished(id, published);
  }
}
