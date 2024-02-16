import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/settings';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('Testing Posts', () => {
  let app: INestApplication;

  const postModel = {
    title: 'Post created by static method',
    shortDescription: 'We are doing likes and dislikes for posts',
    content: 'The content',
  };

  const blogModel = {
    name: 'NEW BLOG',
    description: 'description',
    websiteUrl: 'https://google.com',
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

  it('should return empty array (GET: getAllPosts) => 200 status', async () => {
    const posts = await request(app.getHttpServer()).get('/posts');

    expect(posts.status).toBe(200);
    expect(posts.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it("shouldn't return response (Get: getPostsByBlogId) => 404 status", async () => {
    const posts = await request(app.getHttpServer())
      .get(`/sa/blogs/${uuidv4()}/posts`)
      .auth('admin', 'qwerty');

    expect(posts.status).toBe(404);
  });

  it('should create new post and return it (Post: createBlog, createPostForBlog; Get: getPostById) => 201 status + 200 status', async () => {
    const blog = await request(app.getHttpServer()).post('/sa/blogs').send(blogModel).auth('admin', 'qwerty');

    expect(blog.status).toBe(201);

    const newPost = await request(app.getHttpServer())
      .post(`/sa/blogs/${blog.body.id}/posts`)
      .send(postModel)
      .auth('admin', 'qwerty');

    expect(newPost.status).toBe(201);
    expect(newPost.body).toEqual({
      id: newPost.body.id,
      title: newPost.body.title,
      shortDescription: newPost.body.shortDescription,
      content: newPost.body.content,
      blogId: newPost.body.blogId,
      blogName: newPost.body.blogName,
      createdAt: newPost.body.createdAt,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });

    const foundedPost = await request(app.getHttpServer()).get(`/posts/${newPost.body.id}`);

    expect(foundedPost.status).toBe(200);
    expect(foundedPost.body).toEqual({
      id: newPost.body.id,
      title: newPost.body.title,
      shortDescription: newPost.body.shortDescription,
      content: newPost.body.content,
      blogId: newPost.body.blogId,
      blogName: newPost.body.blogName,
      createdAt: newPost.body.createdAt,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });

  it('Should update post (Get: getAllPosts, Put: updatePostByBlogId) => status 204', async () => {
    const posts = await request(app.getHttpServer()).get('/posts');
    expect(posts.status).toBe(200);

    const updatedPost = await request(app.getHttpServer())
      .put(`/sa/blogs/${posts.body.items[0].blogId}/posts/${posts.body.items[0].id}`)
      .send({
        content: 'Update post in tests',
        shortDescription: 'shortDescription after update',
        title: 'title updated',
      })
      .auth('admin', 'qwerty');

    expect(updatedPost.status).toBe(204);

    const post = await request(app.getHttpServer()).get(`/posts/${posts.body.items[0].id}`);
    expect(post.status).toBe(200);
    expect(post.body).toEqual({
      id: posts.body.items[0].id,
      title: 'title updated',
      shortDescription: 'shortDescription after update',
      content: 'Update post in tests',
      blogId: posts.body.items[0].blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });
});

describe('Testing post likes', () => {
  let app: INestApplication;

  const postModel = {
    title: 'Post created by static method',
    shortDescription: 'We are doing likes and dislikes for posts',
    content: 'The content',
  };

  const blogModel = {
    name: 'NEW BLOG',
    description: 'description',
    websiteUrl: 'https://google.com',
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

  it('should like post + successfully get post by blogId  => 204 status', async () => {
    const newUser = await request(app.getHttpServer())
      .post('/sa/users')
      .send({
        login: 'OtherOl',
        email: 'pilyak003@gmail.com',
        password: '12345678',
      })
      .auth('admin', 'qwerty');
    expect(newUser.status).toBe(201);

    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(blogModel)
      .auth('admin', 'qwerty');
    expect(newBlog.status).toBe(201);

    const newPost = await request(app.getHttpServer())
      .post(`/sa/blogs/${newBlog.body.id}/posts`)
      .send(postModel)
      .auth('admin', 'qwerty');
    expect(newPost.status).toBe(201);

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: 'OtherOl',
      password: '12345678',
    });
    expect(login.status).toBe(200);

    const like = await request(app.getHttpServer())
      .put(`/posts/${newPost.body.id}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(like.status).toBe(204);

    const post = await request(app.getHttpServer())
      .get(`/posts/${newPost.body.id}`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(post.status).toBe(200);
    expect(post.body).toEqual({
      id: newPost.body.id,
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 1,
        dislikesCount: 0,
        myStatus: 'Like',
        newestLikes: [],
      },
    });

    const postsByBlogId = await request(app.getHttpServer())
      .get(`/blogs/${newBlog.body.id}/posts`)
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(postsByBlogId.status).toBe(200);
    expect(postsByBlogId.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: expect.any(String),
          shortDescription: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          blogId: newBlog.body.id,
          blogName: expect.any(String),
          createdAt: expect.any(String),
          extendedLikesInfo: {
            likesCount: 1,
            dislikesCount: 0,
            myStatus: 'Like',
            newestLikes: [],
          },
        },
      ],
    });
  });

  it("shouldn't do like => 404 status", async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      loginOrEmail: 'OtherOl',
      password: '12345678',
    });
    expect(login.status).toBe(200);

    const like = await request(app.getHttpServer())
      .put(`/posts/${uuidv4()}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + login.body.accessToken);
    expect(like.status).toBe(404);
  });

  it("shouldn't do like => 401 status", async () => {
    const blog = await request(app.getHttpServer()).post('/sa/blogs').send(blogModel).auth('admin', 'qwerty');
    expect(blog.status).toBe(201);

    const post = await request(app.getHttpServer())
      .post(`/sa/blogs/${blog.body.id}/posts`)
      .send(postModel)
      .auth('admin', 'qwerty');
    expect(post.status).toBe(201);

    const like = await request(app.getHttpServer())
      .put(`/posts/${post.body.items[0].id}/like-status`)
      .send({ likeStatus: 'Like' })
      .set('Authorization', 'bearer ' + uuidv4());
    expect(like.status).toBe(401);
  });
});
