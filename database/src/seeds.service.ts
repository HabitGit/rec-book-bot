import * as fs from 'fs';
import { GenresRepository } from './repository/genres.repository';
import { CreateGenreDto } from './dto/genres.dto';
import { BookParseDto, CreateBookDto } from './dto/books.dto';
import { Genres } from './entitys/genres.entity';
import { CreateAuthorDto } from './dto/authors.dto';
import { AuthorsRepository } from './repository/authors.repository';
import { BooksRepository } from './repository/books.repository';
import { Authors } from './entitys/authors.entity';

export class DatabaseFiller {
  constructor(
    private genresRepository: GenresRepository,
    private authorsRepository: AuthorsRepository,
    private booksRepository: BooksRepository,
  ) {}

  async fillFullDatabase(): Promise<void> {
    // Таблица жанров
    await this.fillGenres(__dirname + '/../source/maingenres.txt');
    // книги и авторы
    await this.fillBooksAndAuthors(__dirname + '/../source/result.json');
  }

  async fillBooksAndAuthors(filePath: string): Promise<void> {
    //Создаем объект
    const booksData: string = fs.readFileSync(filePath, {
      encoding: 'utf-8',
    });
    const dataObject: BookParseDto[] = JSON.parse(booksData);

    for (const book of dataObject) {
      try {
        const genreId: Genres | null =
          await this.genresRepository.getGenreIdByCodOrId(book.mainGenre);

        // Дата для БД книг
        const bookData: CreateBookDto = {
          litresId: +book.offerId,
          title: book.title,
          date: +book.date,
          url: `https://www.litres.ru/book/${book.offerId}/`,
          pictures: `https://cv6.litres.ru/pub/c/cover_200/${book.offerId}.webp`,
          genreId: genreId ? genreId.id : 0,
          description: book.annotation,
        };

        const authorsArray = [];
        for (const author of book.authors) {
          const authorData: CreateAuthorDto = {
            litresId: +author.subjectId,
            firstName: author.firstName,
            lastName: author.lastName,
            fullName: author.fullNameRodit,
            url: `https://www.litres.ru/author/${author.url}`,
          };

          const newAuthor: Authors =
            await this.authorsRepository.createAuthor(authorData);
          authorsArray.push(newAuthor);
        }

        await this.booksRepository.createBook({
          ...bookData,
          authors: authorsArray,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async fillGenres(filePath: string) {
    const genresData: string = fs.readFileSync(filePath, {
      encoding: 'utf-8',
    });

    const genresDataObj: string[] = genresData
      .trim()
      .split('\n')
      .join('')
      .split('\r');

    const resultGenreArray: CreateGenreDto[] = [];
    for (const genreMultiLang of genresDataObj) {
      const genre = genreMultiLang.trim().split(':');
      resultGenreArray.push({
        name: genre[1] + genre[2],
        genreCod: genre[0],
      });
    }
    return this.genresRepository.createGenre(resultGenreArray);
  }
}
