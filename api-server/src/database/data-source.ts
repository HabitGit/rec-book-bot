import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config({
  path: './../.env',
});

export const DB_OPTIONS: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT_INSIDE),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/**/*-Migration{.js,.ts}'],
  logging: true,
  synchronize: false,
};

export const dataSource = new DataSource(DB_OPTIONS);
