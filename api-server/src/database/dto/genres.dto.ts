export class CreateGenreDto {
  name: string;
  genreCod: string;
}

export class GenresFindOptionsDto {
  take?: number;
  skip?: number;
}
