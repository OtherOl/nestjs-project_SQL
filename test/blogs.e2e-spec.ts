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
    await app.close();
  });

  it('should return empty array => 200 status', async () => {
    const blogs = await request(app.getHttpServer()).get('/blogs');

    expect(blogs.status).toBe(200);
    expect(blogs.body).toEqual({ items: [], page: 1, pageSize: 10, pagesCount: 0, totalCount: 0 });
  });

  it("shouldn't create newBlog => 401 status", async () => {
    const newBlog = {
      name: 'Hello VK',
      description: 'About our life',
      websiteUrl: 'google.com',
    };

    const createdBlog = await request(app.getHttpServer())
      .post('/blogs')
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
      .post('/blogs')
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
      .post('/blogs')
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
    const blog = await request(app.getHttpServer()).get('/blogs/fffff3ea02afffffc87fffff').send();

    expect(blog.status).toBe(404);
  });

  it('should return blog by id => 200 status', async () => {
    const newBlog = await request(app.getHttpServer())
      .post('/blogs')
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
});
