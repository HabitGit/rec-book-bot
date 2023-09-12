import { DataSource, Repository } from 'typeorm';
import { UsersGenres } from '../entitys/users-genres.entity';
import { Injectable } from '@nestjs/common';
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
    await this.save({
      user: user,
      genre: genre,
    });
  }
}
