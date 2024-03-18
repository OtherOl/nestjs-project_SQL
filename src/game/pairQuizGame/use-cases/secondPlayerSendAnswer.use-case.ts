import { ForbiddenException, Injectable } from '@nestjs/common';
import { AnswerStatus, QuestionsViewModel } from '../../../base/types/game.model';
import { Answer } from '../domain/answers.entity';
import { PairQuizGameRepository } from '../repositories/pairQuizGame.repository';
import { QuizQuestionsQueryRepository } from '../../quizQuestions/repositories/quizQuestions.query-repository';
import { ChangeStatusToFinishedUseCase } from './changeStatusToFinished.use-case';
import { FirstPlayerProgress } from '../domain/firstPlayerProgress.entity';
import { ChangeAnswerStatusSecondPlayerUseCase } from './changeAnswerStatusSecondPlayer.use-case';

@Injectable()
export class SecondPlayerSendAnswerUseCase {
  constructor(
    private pairQuizGameRepository: PairQuizGameRepository,
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private changeStatusToFinishedUseCase: ChangeStatusToFinishedUseCase,
    private changeAnswerStatusSecondPlayerUseCase: ChangeAnswerStatusSecondPlayerUseCase,
  ) {}

  async sendAnswer(
    secondPlayer: FirstPlayerProgress,
    gameId: string,
    gameQuestions: QuestionsViewModel[],
    inputAnswer: string,
  ) {
    if (secondPlayer.answers.length === gameQuestions.length) {
      throw new ForbiddenException('You already answered all questions');
    } else {
      const questionNumber: number = secondPlayer.answers.length;
      const gameQuestion: QuestionsViewModel = gameQuestions[questionNumber];
      const question = await this.quizQuestionsQueryRepository.getQuestionById(gameQuestion.id);
      if (question!.correctAnswers.includes(inputAnswer)) {
        const answer = Answer.createAnswer(question!.id, AnswerStatus.Correct);
        await this.pairQuizGameRepository.createAnswer(answer);
        await this.pairQuizGameRepository.sendAnswerSecondPlayer(
          gameId,
          {
            questionId: answer.questionId,
            answerStatus: answer.answerStatus,
            addedAt: answer.addedAt,
          },
          '+ 1',
        );
        await this.changeAnswerStatusSecondPlayerUseCase.changeStatus(gameId, gameQuestions);
        await this.changeStatusToFinishedUseCase.changeToFinished(gameId, gameQuestions);
        return {
          questionId: answer.questionId,
          answerStatus: answer.answerStatus,
          addedAt: answer.addedAt,
        };
      } else if (!question!.correctAnswers.includes(inputAnswer)) {
        const answer = Answer.createAnswer(question!.id, AnswerStatus.Incorrect);
        await this.pairQuizGameRepository.createAnswer(answer);
        await this.pairQuizGameRepository.sendAnswerSecondPlayer(
          gameId,
          {
            questionId: answer.questionId,
            answerStatus: answer.answerStatus,
            addedAt: answer.addedAt,
          },
          '- 0',
        );
        await this.changeAnswerStatusSecondPlayerUseCase.changeStatus(gameId, gameQuestions);
        await this.changeStatusToFinishedUseCase.changeToFinished(gameId, gameQuestions);
        return {
          questionId: answer.questionId,
          answerStatus: answer.answerStatus,
          addedAt: answer.addedAt,
        };
      }
    }
  }
}
