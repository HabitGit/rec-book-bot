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
import { Genres } from '../database/entitys/genres.entity';
import { Books } from '../database/entitys/books.entity';
import { GenresQueryDto } from '../database/dto/genres.dto';
import { BooksQueryDto, LikeOptionsDto } from '../database/dto/books.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/genres')
  async getGenres(@Query() params: GenresQueryDto): Promise<Genres[]> {
    console.log('API, CONTROLLER: ', params);
    return this.booksService.getGenres(params);
  }

  @Get()
  async getBooks(@Query() params: BooksQueryDto): Promise<[Books[], number]> {
    return this.booksService.getBooks(params);
  }

  @Post('/:id')
  async setLike(
    @Param('id', ParseIntPipe) bookId: number,
    @Body(ValidationPipe) likeData: LikeOptionsDto,
  ) {
    return this.booksService.setLike(bookId, likeData);
  }
}
