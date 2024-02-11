import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { appSettings } from '../src/settings';

describe('Testing Blogs', () => {
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

  it('should return empty array => 200 status', async () => {
    const blogs = await request(app.getHttpServer()).get('/sa/blogs').auth('admin', 'qwerty');

    expect(blogs.status).toBe(200);
    expect(blogs.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it("shouldn't create newBlog => 401 status", async () => {
    const newBlog = {
      name: 'Hello VK',
      description: 'About our life',
      websiteUrl: 'google.com',
    };

    const createdBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(newBlog)
      .auth('Hacker', 'qwerty');

    expect(createdBlog.status).toBe(401);
  });

  it("shouldn't create newBlog => 400 status", async () => {
    const newBlog = {
      name: ' ',
      description: 'About our life',
      websiteUrl: 'google.com',
    };

    const createdBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(newBlog)
      .auth('admin', 'qwerty');

    expect(createdBlog.status).toBe(400);
  });

  it('should create new blog => 201 status', async () => {
    const newBlog = {
      name: 'Hello YouTube',
      description: 'About our life',
      websiteUrl: 'google.com',
    };

    const createdBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send(newBlog)
      .auth('admin', 'qwerty');

    expect(createdBlog.status).toBe(201);
    expect(createdBlog.body).toEqual({
      id: expect.any(String),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it("shouldn't return blog by id => 404 status", async () => {
    const blog = await request(app.getHttpServer())
      .get('/sa/blogs/2e4f5446-6045-4db3-b2e3-887d12f6aaca')
      .send();

    expect(blog.status).toBe(404);
  });

  it('should return blog by id => 200 status', async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send({ name: 'Hello YouTube', description: 'About your life', websiteUrl: 'google.com' })
      .auth('admin', 'qwerty');

    expect(newBlog.status).toBe(201);

    const blog = await request(app.getHttpServer()).get(`/blogs/${newBlog.body.id}`);
    expect(blog.status).toBe(200);
    expect(blog.body).toEqual({
      id: newBlog.body.id,
      name: newBlog.body.name,
      description: newBlog.body.description,
      websiteUrl: newBlog.body.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should update blog => 204 status', async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send({ name: 'Hello YouTube', description: 'About your life', websiteUrl: 'google.com' })
      .auth('admin', 'qwerty');

    expect(newBlog.status).toBe(201);

    const updatedBlog = await request(app.getHttpServer())
      .put(`/sa/blogs/${newBlog.body.id}`)
      .send({ name: 'Updated blog', description: 'Valid text', websiteUrl: 'OKKEEEY.com' })
      .auth('admin', 'qwerty');

    expect(updatedBlog.status).toBe(204);

    const blog = await request(app.getHttpServer()).get(`/blogs/${newBlog.body.id}`);

    expect(blog.status).toBe(200);
    expect(blog.body).toEqual({
      id: newBlog.body.id,
      name: 'Updated blog',
      description: expect.any(String),
      websiteUrl: expect.any(String),
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it("shouldn't delete blog by id => 404 status", async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send({ name: 'Hello YouTube', description: 'About your life', websiteUrl: 'google.com' })
      .auth('admin', 'qwerty');

    expect(newBlog.status).toBe(201);

    const deletedBlog = await request(app.getHttpServer())
      .delete(`/sa/2e4f5446-6045-4db3-b2e3-887d12f6aaca`)
      .auth('admin', 'qwerty');

    expect(deletedBlog.status).toBe(404);
  });

  it('should delete blog by id => 204 status', async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send({ name: 'Hello YouTube', description: 'About my life', websiteUrl: 'google.com' })
      .auth('admin', 'qwerty');

    expect(newBlog.status).toBe(201);

    const deletedBlog = await request(app.getHttpServer())
      .delete(`/sa/blogs/${newBlog.body.id}`)
      .auth('admin', 'qwerty');

    expect(deletedBlog.status).toBe(204);

    const isExists = await request(app.getHttpServer()).get(`/sa/blogs/${newBlog.body.id}`).send();

    expect(isExists.status).toBe(404);
  });

  it('should create Post by blogId => 201 status', async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/sa/blogs')
      .send({ name: 'Hello YouTube', description: 'About my life', websiteUrl: 'google.com' })
      .auth('admin', 'qwerty');

    expect(newBlog.status).toBe(201);

    const post = await request(app.getHttpServer())
      .post(`/sa/blogs/${newBlog.body.id}/posts`)
      .send({
        title: 'Post created by static method',
        shortDescription: 'We are doing likes and dislikes for posts',
        content: 'yesyesyesyesyesyesye',
      })
      .auth('admin', 'qwerty');

    expect(post.status).toBe(201);
    expect(post.body).toEqual({
      id: expect.any(String),
      title: post.body.title,
      shortDescription: post.body.shortDescription,
      content: post.body.content,
      blogId: post.body.blogId,
      blogName: post.body.blogName,
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
