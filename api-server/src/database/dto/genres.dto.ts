import { IsInt } from 'class-validator';

export class CreateGenreDto {
  name: string;
  genreCod: string;
}

export class GenresFindOptionsDto {
  take?: number;
  skip?: number;
}

export class GenresQueryDto {
  page: number;
  size: number;
}
