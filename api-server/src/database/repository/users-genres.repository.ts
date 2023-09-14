import { DataSource, Repository } from 'typeorm';
import { UsersGenres } from '../entitys/users-genres.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '../entitys/users.entity';
import { Genres } from '../entitys/genres.entity';

@Injectable()
export class UsersGenresRepository extends Repository<UsersGenres> {
  constructor(private dataSource: DataSource) {
    super(UsersGenres, dataSource.createEntityManager());
  }

  // async getTopGenreIdByUserId(userId: number): Promise<UsersGenres> {
  //   const isGenre: UsersGenres | null = await this.findOne({
  //     select: { genreId: true },
  //     where: { userId: userId },
  //   });
  //   if (!isGenre) throw new Error('Такой юзер скорее всего не зарегистрирован');
  //   return isGenre;
  // }

  async createPreference(user: Users, genre: Genres) {
    const isPreference: UsersGenres | null = await this.findOne({
      where: {
        user: user,
      },
    });
    if (isPreference) {
      throw new HttpException(
        'Такая статистика уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.save({
      user: user,
      genre: genre,
    });
  }

  async addLikeByUser(user: Users, genre: Genres) {
    const preference = await this.findOne({
      where: {
        user,
        genre,
      },
    });
    return this.save({
      ...preference,
      preferenceLevel: preference.preferenceLevel + 1,
    });
  }
}
