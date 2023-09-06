import { DataSource, Repository } from 'typeorm';
import { Genres } from '../entitys/genres.entity';
import { CreateGenreDto } from '../dto/genres.dto';

export class GenresRepository extends Repository<Genres> {
  constructor(private dataSource: DataSource) {
    super(Genres, dataSource.createEntityManager());
  }

  async getGenreIdByCodOrId(genreData: string | number) {
    const findOptions =
      typeof genreData === 'string'
        ? { genreCod: genreData }
        : { id: genreData };
    return this.findOne({
      where: findOptions,
    });
  }

  async createGenre(genreData: CreateGenreDto[]) {
    for (const genre of genreData) {
      const isGenre: Genres | null = await this.getGenreIdByCodOrId(
        genre.genreCod,
      );
      if (isGenre) throw new Error('Такой жанр уже существует');
      if (!isGenre) {
        try {
          await this.save(genre);
        } catch (e) {
          console.log('Жанр:', genre, 'Не добавлен.');
        }
      }
    }
  }
}
