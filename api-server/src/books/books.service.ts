import { Injectable } from '@nestjs/common';
import { Genres } from '../database/entitys/genres.entity';
import { GenresRepository } from '../database/repository/genres.repository';
import { DatabaseService } from '../database/database.service';
import { GenresQueryDto } from './dto/genres.gto';

@Injectable()
export class BooksService {
  constructor(
    private genresRepository: GenresRepository,
    private databaseService: DatabaseService,
  ) {}

  async getGenres(params: GenresQueryDto): Promise<Genres[]> {
    const { take, skip } = this.databaseService.getPagination(params);
    return this.genresRepository.getAllGenres({ take, skip });
  }
}
