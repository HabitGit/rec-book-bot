import { DataSource, Raw, Repository } from 'typeorm';
import { UsersGenres } from '../entitys/users-genres.entity';

export class UsersGenresRepository extends Repository<UsersGenres> {
  constructor(private dataSource: DataSource) {
    super(UsersGenres, dataSource.createEntityManager());
  }

  async getTopGenreIdByUserId(userId: number): Promise<UsersGenres> {
    const isGenre: UsersGenres | null = await this.findOne({
      select: { genreId: true },
      where: { userId: userId },
    });
    if (!isGenre) throw new Error('Такой юзер скорее всего не зарегистрирован');
    return isGenre;
  }
}