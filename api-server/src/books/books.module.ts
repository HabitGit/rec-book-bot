import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [DatabaseModule],
})
export class BooksModule {}
