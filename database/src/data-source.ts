import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  logging: true,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/**/*-Migration.ts'],
  migrationsTableName: 'migrations',
});

export async function dbInit() {
  await AppDataSource.initialize()
    .then(() => console.log('DB has connected...'))
    .catch((error) => console.log('Error in DB: ', error));
}
