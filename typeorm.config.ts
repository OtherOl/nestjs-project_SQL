import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as process from 'process';

config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export default new DataSource({
  host: PGHOST,
  port: 5432,
  type: 'postgres',
  migrations: ['migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
  username: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  ssl: true,
});
