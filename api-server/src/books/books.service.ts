import { Injectable } from '@nestjs/common';
import { Genres } from '../database/entitys/genres.entity';
import { GenresRepository } from '../database/repository/genres.repository';
import { DatabaseService } from '../database/database.service';
import { GenresQueryDto } from '../database/dto/genres.dto';
import { BooksRepository } from '../database/repository/books.repository';
import { BooksQueryDto } from '../database/dto/books.dto';

@Injectable()
export class BooksService {
  constructor(
    private genresRepository: GenresRepository,
    private databaseService: DatabaseService,
    private booksRepository: BooksRepository,
  ) {}

  async getGenres(params: GenresQueryDto): Promise<Genres[]> {
    const { take, skip } = this.databaseService.getPagination(params);
    return this.genresRepository.getAllGenres({ take, skip });
  }

  async getBooks(params: BooksQueryDto) {
    const { take, skip } = this.databaseService.getPagination({
      page: params.page,
      size: params.size,
    });
    return this.booksRepository.getBooks({
      take,
      skip,
      genreId: params.genreId,
    });
  }
}
