import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_OPTIONS } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(DB_OPTIONS)],
})
export class DatabaseModule {}
