import { ForbiddenException, Injectable } from '@nestjs/common';
import { AnswerStatus, QuestionsViewModel } from '../../../base/types/game.model';
import { Answer } from '../domain/answers.entity';
import { FirstPlayerProgress } from '../domain/firstPlayerProgress.entity';
import { PairQuizGameQueryRepository } from '../repositories/pairQuizGame.query-repository';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuizQuestionsQueryRepository } from '../../quizQuestions/repositories/quizQuestions.query-repository';
import { ChangeStatusToFinishedUseCase } from './changeStatusToFinished.use-case';

@Injectable()
export class FirstPlayerSendAnswerUseCase {
  constructor(
    private pairQuizGameQueryRepository: PairQuizGameQueryRepository,
    private pairQuizGameRepository: PairQuizGameRepository,
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private changeStatusToFinishedUseCase: ChangeStatusToFinishedUseCase,
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
          await this.changeStatusToFinishedUseCase.changeToFinished(firstPlayer.gameId);
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
          await this.changeStatusToFinishedUseCase.changeToFinished(firstPlayer.gameId);
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
