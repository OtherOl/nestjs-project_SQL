import { INestApplication } from '@nestjs/common';
import { beforeGetAppAndCleanDb, userCreateModel } from './utils/test-utils';
import { userModel } from '../src/base/types/users.model';
import request from 'supertest';
import { GameViewModel } from '../src/base/types/game.model';

jest.setTimeout(10000);
describe('Testing Game', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await beforeGetAppAndCleanDb();
  });

  let user1: userModel;
  let accessToken1: string;
  it('should create user1 and login user1 => 201 status', async () => {
    const newUser1 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('OtherOl', 'qwerty', 'pilya003@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser1.status).toBe(201);
    user1 = newUser1.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user1.login, password: 'qwerty' });
    expect(login.status).toBe(200);
    accessToken1 = login.body.accessToken;
  });

  let user2: userModel;
  let accessToken2: string;
  it('should create user2 and login user2 => 201 status', async () => {
    const newUser2 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('User2', '12345678', 'pilya00@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser2.status).toBe(201);
    user2 = newUser2.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user2.login, password: '12345678' });
    expect(login.status).toBe(200);
    accessToken2 = login.body.accessToken;
  });

  let user3: userModel;
  let accessToken3: string;
  it('should create user3 and login user3 => 201 status', async () => {
    const newUser3 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('User3', '12345678', 'pilya0@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser3.status).toBe(201);
    user3 = newUser3.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user3.login, password: '12345678' });
    expect(login.status).toBe(200);
    accessToken3 = login.body.accessToken;
  });

  it("Shouldn't return, because user doesn't playing => 404 status", async () => {
    const game = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(404);
  });

  it("Shouldn't return and create/connect game => 401 status", async () => {
    const getGame = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer THISISNOTTOKEN');
    expect(getGame.status).toBe(401);

    const createGame = await request(app.getHttpServer()).post('/pair-game-quiz/pairs/connection');
    expect(createGame.status).toBe(401);
  });

  let game1: GameViewModel;
  it('should create new game and return it twice => 200 status', async () => {
    const createdGame = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(createdGame.status).toBe(200);
    expect(createdGame.body).toEqual({
      id: createdGame.body.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: createdGame.body.firstPlayerProgress.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: null,
      questions: [],
      status: 'PendingSecondPlayer',
      pairCreatedDate: expect.any(String),
      startGameDate: null,
      finishGameDate: null,
    });
    game1 = createdGame.body;

    const getGame = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my-current')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(getGame.status).toBe(200);
    expect(getGame.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: null,
      questions: [],
      status: 'PendingSecondPlayer',
      pairCreatedDate: expect.any(String),
      startGameDate: null,
      finishGameDate: null,
    });
  });

  it('Should connect user2 to existing game and change status to active => 200 status', async () => {
    const existingGame = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', 'bearer ' + accessToken2);
    expect(existingGame.status).toBe(200);
    expect(existingGame.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: {
        score: 0,
        player: {
          id: existingGame.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [],
      },
      questions: [
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 0 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 1 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 2 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 3 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 4 = ?',
        },
      ],
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it("Shouldn't create/connect game, because user is in active game => 403 status", async () => {
    const game = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(403);
  });

  it("Shouldn't get game by id => 401 status", async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer DASDSADSAD');
    expect(game.status).toBe(401);
  });

  it("Shouldn't get game by id => 403 status", async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken3);
    expect(game.status).toBe(403);
  });

  it("Shouldn't get game by id => 404 status", async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/gameidmaybe`)
      .set('Authorization', 'bearer ' + accessToken3);
    expect(game.status).toBe(404);
  });

  // it("Shouldn't get game by id => 400 status", async () => {
  //   const game = await request(app.getHttpServer())
  //     .get(`/pair-game-quiz/pairs/` + 123123213)
  //     .set('Authorization', 'bearer ' + accessToken3);
  //   expect(game.status).toBe(400);
  // });

  it('Should return game by id => 200 status', async () => {
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(200);
    expect(game.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 0,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [],
      },
      secondPlayerProgress: {
        score: 0,
        player: {
          id: game.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [],
      },
      questions: [
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 0 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 1 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 2 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 3 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 4 = ?',
        },
      ],
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it("Shouldn't send answer => 401 status", async () => {
    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: 'This is not answer' })
      .set('Authorization', 'bearer HOHOHHOBOMBOBM');
    expect(sendAnswer.status).toBe(401);
  });

  let user4: userModel;
  let accessToken4: string;
  it("Shouldn't send answer, because user is not inside active pair => 403 status", async () => {
    const newUser4 = await request(app.getHttpServer())
      .post('/sa/users')
      .send(userCreateModel('User4', '12345678', 'pilya@gmail.com'))
      .auth('admin', 'qwerty');
    expect(newUser4.status).toBe(201);
    user4 = newUser4.body;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: user4.login, password: '12345678' });
    expect(login.status).toBe(200);
    accessToken4 = login.body.accessToken;

    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: 'Some answer' })
      .set('Authorization', 'bearer ' + accessToken4);
    expect(sendAnswer.status).toBe(403);
  });

  it('Should send right answers for 1-3 questions by firstPlayer and return it => 200 status', async () => {
    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: '1' })
      .set('Authorization', 'bearer ' + accessToken1);
    expect(sendAnswer.status).toBe(200);
    expect(sendAnswer.body).toEqual({
      questionId: expect.any(String),
      answerStatus: 'Correct',
      addedAt: expect.any(String),
    });

    const sendAnswer2 = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: '2' })
      .set('Authorization', 'bearer ' + accessToken1);
    expect(sendAnswer2.status).toBe(200);
    expect(sendAnswer2.body).toEqual({
      questionId: expect.any(String),
      answerStatus: 'Correct',
      addedAt: expect.any(String),
    });

    const sendAnswer3 = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: '3' })
      .set('Authorization', 'bearer ' + accessToken1);
    expect(sendAnswer3.status).toBe(200);
    expect(sendAnswer3.body).toEqual({
      questionId: expect.any(String),
      answerStatus: 'Correct',
      addedAt: expect.any(String),
    });

    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(200);
    expect(game.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 3,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
        ],
      },
      secondPlayerProgress: {
        score: 0,
        player: {
          id: game.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [],
      },
      questions: [
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 0 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 1 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 2 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 3 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 4 = ?',
        },
      ],
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it('Should send incorrect/correct answers for 1-5 questions by secondPlayer and return it => 200 status', async () => {
    for (let i = 0; i < 5; i++) {
      const sendAnswer = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .send({ answer: '1' })
        .set('Authorization', 'bearer ' + accessToken2);
      expect(sendAnswer.status).toBe(200);
      expect(sendAnswer.body).toEqual({
        questionId: expect.any(String),
        answerStatus: expect.any(String),
        addedAt: expect.any(String),
      });
    }
    const game = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${game1.id}`)
      .set('Authorization', 'bearer ' + accessToken1);
    expect(game.status).toBe(200);
    expect(game.body).toEqual({
      id: game1.id,
      firstPlayerProgress: {
        score: 3,
        player: {
          id: game1.firstPlayerProgress!.player.id,
          login: 'OtherOl',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
        ],
      },
      secondPlayerProgress: {
        score: 1,
        player: {
          id: game.body.secondPlayerProgress!.player.id,
          login: 'User2',
        },
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: 'Correct',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
          {
            questionId: expect.any(String),
            answerStatus: 'Incorrect',
            addedAt: expect.any(String),
          },
        ],
      },
      questions: [
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 0 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 1 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 2 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 3 = ?',
        },
        {
          id: expect.any(String),
          body: 'Solve the follow problem => 1 + 4 = ?',
        },
      ],
      status: 'Active',
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: null,
    });
  });

  it("Shouldn't send answer by secondPlayer, because answered all questions => 403 status", async () => {
    const sendAnswer = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .send({ answer: '100' })
      .set('Authorization', 'bearer ' + accessToken2);
    expect(sendAnswer.status).toBe(403);
  });
});
