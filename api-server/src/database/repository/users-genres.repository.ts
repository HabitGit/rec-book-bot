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

  async getTopGenreIdByUserId(userId: number) {
    const maxPreferenceLevel: number = await this.maximum('preferenceLevel', {
      user: { userId },
    });
    return this.findOne({
      relations: { genre: true },
      where: {
        preferenceLevel: maxPreferenceLevel,
      },
    });
  }

  async createPreference(user: Users, genre: Genres) {
    const isPreference = await this.findOne({
      where: {
        user: { id: user.id },
        genre: { id: genre.id },
      },
    });
    if (isPreference) {
      await this.save({
        ...isPreference,
        preferenceLevel: isPreference.preferenceLevel + 1,
      });
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
