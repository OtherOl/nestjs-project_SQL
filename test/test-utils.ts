import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/settings';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export async function beforeGetAppAndCleanDb() {
  let app: INestApplication;

  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  // eslint-disable-next-line prefer-const
  app = module.createNestApplication();
  appSettings(app);
  await app.init();
  const db = await request(app.getHttpServer()).delete('/testing/all-data').send();
  expect(db.status).toBe(204);

  return app;
}
