import { DataSource, Repository } from 'typeorm';
import { Genres } from '../entitys/genres.entity';
import { CreateGenreDto } from '../dto/genres.dto';

export class GenresRepository extends Repository<Genres> {
  constructor(private dataSource: DataSource) {
    super(Genres, dataSource.createEntityManager());
  }

  async getGenreByCod(genreCod: string) {
    return this.findOne({
      where: { genreCod: genreCod },
    });
  }

  async createGenre(genreData: CreateGenreDto[]) {
    for (const genre of genreData) {
      const isGenre: Genres | null = await this.getGenreByCod(genre.genreCod);
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
