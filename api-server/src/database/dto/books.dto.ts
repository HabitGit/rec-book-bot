import { Authors } from '../entitys/authors.entity';

export class CreateBookDto {
  litresId: number;
  title: string;
  date: number;
  url: string;
  pictures: string;
  genreId: number;
  description: string;
  authors?: Authors[];
}

export class UpdateBookDto {
  litresId: number;
  title?: string;
  date?: number;
  url?: string;
  pictures?: string;
  genreId?: number;
  description?: string;
  authors?: Authors[];
}

export class AuthorsParseDto {
  subjectId: string;
  url: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullNameRodit: string;
  lvl: string;
  relation: string;
}

export class BookParseDto {
  offerId: string;
  availableForBuy: boolean;
  title: string;
  price: string;
  date: string;
  lang: string;
  sequence: string;
  authors: AuthorsParseDto[];
  rating: string;
  artRelations: [];
  added: string;
  mainGenre: string;
  annotation: string;
  categoryId: string;
  url: string;
  picture: string;
  genresList: [];
  publisher: string;
  series: string;
  year: string;
  ISBN: string;
  description: string;
  downloadable: string;
  age: string;
}

export class BooksQueryDto {
  page: number;
  size: number;
  genreId: number;
}

export class FindOptionsDto {
  take?: number;
  skip?: number;
  genreId?: number;
}
