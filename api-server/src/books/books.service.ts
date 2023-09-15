import { Injectable } from '@nestjs/common';
import { Genres } from '../database/entitys/genres.entity';
import { GenresRepository } from '../database/repository/genres.repository';
import { DatabaseService } from '../database/database.service';
import { GenresQueryDto } from '../database/dto/genres.dto';
import { BooksRepository } from '../database/repository/books.repository';
import { BooksQueryDto, LikeOptionsDto } from '../database/dto/books.dto';
import { UsersGenresRepository } from '../database/repository/users-genres.repository';
import { Users } from '../database/entitys/users.entity';
import { UsersRepository } from '../database/repository/users.repository';
import { UsersBooksRepository } from '../database/repository/users-books.repository';
import { Books } from '../database/entitys/books.entity';

@Injectable()
export class BooksService {
  constructor(
    private genresRepository: GenresRepository,
    private databaseService: DatabaseService,
    private booksRepository: BooksRepository,
    private usersGenresRepository: UsersGenresRepository,
    private usersRepository: UsersRepository,
    private usersBooksRepository: UsersBooksRepository,
  ) {}

  async getGenres(params: GenresQueryDto): Promise<Genres[]> {
    const { take, skip } = this.databaseService.getPagination(params);
    return this.genresRepository.getAllGenres({ take, skip });
  }

  async getBooks(params: BooksQueryDto) {
    const genre: Genres = await this.genresRepository.getGenreByCodOrId(
      +params.genreId,
    );
    const user: Users = await this.usersRepository.getUserByUserId(
      params.userId,
    );
    //Создаем статистику жанра если ее еще нет
    try {
      await this.usersGenresRepository.createPreference(user, genre);
    } catch (e) {
      console.log(e);
      //Нужно дописать проверку на ошибку
    }

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

  async setLike(bookId: number, likeData: LikeOptionsDto) {
    const user: Users = await this.usersRepository.getUserByUserId(
      likeData.userId,
    );
    const book: [Books[], number] = await this.booksRepository.getBooks({
      id: bookId,
    });
    return this.usersBooksRepository.addLikeByBook(
      user,
      book[0][0],
      likeData.type,
    );
  }
}
