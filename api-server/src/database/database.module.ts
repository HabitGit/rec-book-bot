import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_OPTIONS } from './data-source';
import { AuthorsRepository } from './repository/authors.repository';
import { BooksRepository } from './repository/books.repository';
import { GenresRepository } from './repository/genres.repository';
import { UsersRepository } from './repository/users.repository';
import { UsersGenresRepository } from './repository/users-genres.repository';

@Module({
  imports: [TypeOrmModule.forRoot(DB_OPTIONS)],
  providers: [
    AuthorsRepository,
    BooksRepository,
    GenresRepository,
    UsersRepository,
    UsersGenresRepository,
  ],
  exports: [UsersRepository, UsersGenresRepository],
})
export class DatabaseModule {}
