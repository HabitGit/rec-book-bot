import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Books } from '../database/entitys/books.entity';
import { GenresQueryDto } from '../database/dto/genres.dto';
import { BooksQueryDto, LikeOptionsDto } from '../database/dto/books.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/genres')
  async getGenres(@Query() params: GenresQueryDto) {
    console.log('API, CONTROLLER: ', params);
    return this.booksService.getGenres(params);
  }

  @Get('/random')
  async getRandomBook(@Query() params: { userId: number }) {
    return this.booksService.getRandomBook(params);
  }

  @Get('/user/:id')
  async getLikesBooks(
    @Param('id', ParseIntPipe) userId: number,
    @Query() params: { page: number; size: number },
  ) {
    return this.booksService.getLikesBooks(userId, params);
  }

  @Get('/:id')
  async getBookById(@Param('id', ParseIntPipe) bookId: number) {
    return this.booksService.getBookById(bookId);
  }

  @Post('/:id')
  async setLike(
    @Param('id', ParseIntPipe) bookId: number,
    @Body(ValidationPipe) likeData: LikeOptionsDto,
  ) {
    return this.booksService.setLike(bookId, likeData);
  }

  @Get()
  async getBooksByGenre(
    @Query() params: BooksQueryDto,
  ): Promise<[Books[], number]> {
    return this.booksService.getBooksByGenre(params);
  }
}
