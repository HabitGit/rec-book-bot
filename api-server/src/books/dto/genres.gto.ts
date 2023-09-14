import { IsInt } from 'class-validator';

export class GenresQueryDto {
  @IsInt()
  page: number;
  @IsInt()
  size: number;
}
