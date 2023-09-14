import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Genres } from '../database/entitys/genres.entity';
import { GenresQueryDto } from './dto/genres.gto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/genres')
  async getGenres(@Query() params: GenresQueryDto): Promise<Genres[]> {
    console.log('API, CONTROLLER: ', params);
    return this.booksService.getGenres(params);
  }
}
