import { join as path } from 'path';
import { DataSource } from 'typeorm';
import { config as dotenv } from 'dotenv';

dotenv();

export default new DataSource({
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: false,
  logging: false,
  migrationsRun: true,
  entities: [path(__dirname, '../app/**/*.entity{.ts,.js}')],
  migrations: [path(__dirname, './migrations/*{.ts,.js}')],
  timezone: '-03:00',
});
