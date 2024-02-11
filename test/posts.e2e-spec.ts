import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/settings';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('Testing Posts', () => {
  let app: INestApplication;

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
    const blog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send({ name: 'NEW BLOG', description: 'description', websiteUrl: 'https://google.com' })
      .auth('admin', 'qwerty');

    expect(blog.status).toBe(201);

    const newPost = await request(app.getHttpServer())
      .post(`/sa/blogs/${blog.body.id}/posts`)
      .send({
        title: 'Post created by static method',
        shortDescription: 'We are doing likes and dislikes for posts',
        content: 'The content',
      })
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
