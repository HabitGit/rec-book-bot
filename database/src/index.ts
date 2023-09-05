import { AppDataSource, dbInit } from './data-source';
import { DatabaseFiller } from './seeds.service';
import { GenresRepository } from './repository/genres.repository';
import { AuthorsRepository } from './repository/authors.repository';
import { BooksRepository } from './repository/books.repository';

async function start() {
  await dbInit();

  const genresRepository = new GenresRepository(AppDataSource);
  const authorsRepository = new AuthorsRepository(AppDataSource);
  const booksRepository = new BooksRepository(AppDataSource);
  const dbFiller = new DatabaseFiller(
    genresRepository,
    authorsRepository,
    booksRepository,
  );
}

start();
