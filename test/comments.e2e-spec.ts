import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/settings';
import request from 'supertest';

describe('Testing comments', () => {
  let app: INestApplication;

  const newUser = {
    login: 'OtherOl',
    password: '12345678',
    email: 'pilyak003@gmail.com',
  };

  const newPost = {
    title: 'Post created by static method',
    shortDescription: 'We are doing likes and dislikes for posts',
    content: 'The content',
  };

  const newBlog = {
    name: 'Hello YouTube',
    description: 'About our life',
    websiteUrl: 'google.com',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();

    appSettings(app);

    await app.init();
    const db = await request(app.getHttpServer()).delete('/testing/all-data').send();
    expect(db.status).toBe(204);
  });

  afterAll(async () => {
    const db = await request(app.getHttpServer()).delete('/testing/all-data').send();
    expect(db.status).toBe(204);
    await app.close();
  });

  it('Should create new Comment + get comment => 201 status', async () => {
    const createdUser = await request(app.getHttpServer())
      .post('/sa/users')
      .send(newUser)
      .auth('admin', 'qwerty');
    expect(createdUser.status).toBe(201);
    expect(createdUser.body).toEqual({
      id: expect.any(String),
      login: newUser.login,
      email: newUser.email,
      createdAt: expect.any(String),
    });

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: newUser.login,
      password: newUser.password,
    });

    expect(login.status).toBe(200);
    expect(login.body).toEqual({
      accessToken: expect.any(String),
    });

    const blog = await request(app.getHttpServer()).post('/sa/blogs').send(newBlog).auth('admin', 'qwerty');
    expect(blog.status).toBe(201);

    const post = await request(app.getHttpServer())
      .post(`/sa/blogs/${blog.body.id}/posts`)
      .send(newPost)
      .auth('admin', 'qwerty');

    expect(post.status).toBe(201);

    const comment = await request(app.getHttpServer())
      .post(`/posts/${post.body.id}/comments`)
      .send({
        content: "COMMENT 2 BY NEW USER WITH NAME: 'OtherOl'",
      })
      .set('Authorization', 'bearer ' + login.body.accessToken);

    expect(comment.status).toBe(201);
    expect(comment.body).toEqual({
      id: comment.body.id,
      content: comment.body.content,
      commentatorInfo: {
        userId: comment.body.commentatorInfo.userId,
        userLogin: comment.body.commentatorInfo.userLogin,
      },
      createdAt: comment.body.createdAt,
      likesInfo: {
        likesCount: comment.body.likesInfo.likesCount,
        dislikesCount: comment.body.likesInfo.dislikesCount,
        myStatus: comment.body.likesInfo.myStatus,
      },
    });

    const getComment = await request(app.getHttpServer()).get(`/comments/${comment.body.id}`);
    expect(getComment.status).toBe(200);
    expect(getComment.body).toEqual({
      id: comment.body.id,
      content: comment.body.content,
      commentatorInfo: {
        userId: comment.body.commentatorInfo.userId,
        userLogin: comment.body.commentatorInfo.userLogin,
      },
      createdAt: comment.body.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    });
  });

  it("shouldn't create new comment => 400 status", async () => {
    const post = await request(app.getHttpServer()).get('/posts');
    expect(post.status).toBe(200);

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: 'OtherOl',
      password: '12345678',
    });
    expect(login.status).toBe(200);
    expect(login.body).toEqual({
      accessToken: expect.any(String),
    });

    const comment = await request(app.getHttpServer())
      .post(`/posts/${post.body.items[0].id}/comments`)
      .send({
        content: '400',
      })
      .set('Authorization', 'bearer ' + login.body.accessToken);

    expect(comment.status).toBe(400);
  });
});

describe('Testing comments likes', () => {
  let app: INestApplication;

  const newUser = {
    login: 'OtherOl',
    password: '12345678',
    email: 'pilyak003@gmail.com',
  };

  const newPost = {
    title: 'Post created by static method',
    shortDescription: 'We are doing likes and dislikes for posts',
    content: 'The content',
  };

  const newBlog = {
    name: 'Hello YouTube',
    description: 'About our life',
    websiteUrl: 'google.com',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();

    appSettings(app);

    await app.init();
    const db = await request(app.getHttpServer()).delete('/testing/all-data').send();
    expect(db.status).toBe(204);
  });

  afterAll(async () => {
    const db = await request(app.getHttpServer()).delete('/testing/all-data').send();
    expect(db.status).toBe(204);
    await app.close();
  });

  it('should do like for comment => 204 status', async () => {
    const createdUser = await request(app.getHttpServer())
      .post('/sa/users')
      .send(newUser)
      .auth('admin', 'qwerty');
    expect(createdUser.status).toBe(201);

    const blog = await request(app.getHttpServer()).post('/sa/blogs').send(newBlog).auth('admin', 'qwerty');
    expect(blog.status).toBe(201);

    const post = await request(app.getHttpServer())
      .post(`/sa/blogs/${blog.body.id}/posts`)
      .send(newPost)
      .auth('admin', 'qwerty');
    expect(post.status).toBe(201);

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: newUser.login,
      password: newUser.password,
    });
    expect(login.status).toBe(200);

    const comment = await request(app.getHttpServer())
      .post(`/posts/${post.body.id}/comments`)
      .send({
        content: "This comment in usage for test: 'OtherOl'",
      })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(comment.status).toBe(201);

    const like = await request(app.getHttpServer())
      .put(`/comments/${comment.body.id}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(like.status).toBe(204);

    const getComment = await request(app.getHttpServer())
      .get(`/comments/${comment.body.id}`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(getComment.status).toBe(200);
    expect(getComment.body).toEqual({
      id: getComment.body.id,
      content: getComment.body.content,
      commentatorInfo: {
        userId: getComment.body.commentatorInfo.userId,
        userLogin: getComment.body.commentatorInfo.userLogin,
      },
      createdAt: getComment.body.createdAt,
      likesInfo: {
        likesCount: getComment.body.likesInfo.likesCount,
        dislikesCount: getComment.body.likesInfo.dislikesCount,
        myStatus: 'Like',
      },
    });

    const commentsPostId = await request(app.getHttpServer())
      .get(`/posts/${post.body.id}/comments`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(commentsPostId.status).toBe(200);
    expect(commentsPostId.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: comment.body.id,
          content: comment.body.content,
          commentatorInfo: {
            userId: comment.body.commentatorInfo.userId,
            userLogin: comment.body.commentatorInfo.userLogin,
          },
          createdAt: comment.body.createdAt,
          likesInfo: {
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
          },
        },
      ],
    });
  });
});
