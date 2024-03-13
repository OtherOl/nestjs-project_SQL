import { ForbiddenException, Injectable } from '@nestjs/common';
import { AnswerStatus, QuestionsViewModel } from '../../../base/types/game.model';
import { Answer } from '../domain/answers.entity';
import { FirstPlayerProgress } from '../domain/firstPlayerProgress.entity';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuizQuestionsQueryRepository } from '../../quizQuestions/repositories/quizQuestions.query-repository';

@Injectable()
export class FirstPlayerSendAnswerUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
  ) {}

  async sendAnswer(firstPlayer: FirstPlayerProgress, inputAnswer: string) {
    const game = await this.pairQuizGameQueryRepository.getGameById(firstPlayer.gameId);
    if (game!.status === 'Active') {
      if (firstPlayer.answers.length === game!.questions.length) {
        throw new ForbiddenException('You already answered all questions');
      } else {
        const questionNumber: number = firstPlayer.answers.length;
        const gameQuestion: QuestionsViewModel = game!.questions[questionNumber];
        const question = await this.quizQuestionsQueryRepository.getQuestionById(gameQuestion.id);
        if (question!.correctAnswers.includes(inputAnswer)) {
          const answer = Answer.createAnswer(question!.id, AnswerStatus.Correct);
          await this.pairQuizGameRepository.createAnswer(answer);
          await this.pairQuizGameRepository.sendAnswerFirstPlayer(
            firstPlayer.gameId,
            {
              questionId: answer.questionId,
              answerStatus: answer.answerStatus,
              addedAt: answer.addedAt,
            },
            '+ 1',
          );
          return {
            questionId: answer.questionId,
            answerStatus: answer.answerStatus,
            addedAt: answer.addedAt,
          };
        } else if (!question!.correctAnswers.includes(inputAnswer)) {
          const answer = Answer.createAnswer(question!.id, AnswerStatus.Incorrect);
          await this.pairQuizGameRepository.createAnswer(answer);
          await this.pairQuizGameRepository.sendAnswerFirstPlayer(
            firstPlayer.gameId,
            {
              questionId: answer.questionId,
              answerStatus: answer.answerStatus,
              addedAt: answer.addedAt,
            },
            '- 0',
          );
          return {
            questionId: answer.questionId,
            answerStatus: answer.answerStatus,
            addedAt: answer.addedAt,
          };
        }
      }
    } else {
      throw new ForbiddenException('No active pair');
    }
  }
}
