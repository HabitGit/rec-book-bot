import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';
import { Genres } from '../database/entitys/genres.entity';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/genres')
  async getGenres(): Promise<Genres[]> {
    return this.booksService.getGenres();
  }
}
