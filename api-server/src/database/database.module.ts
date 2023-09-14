import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_OPTIONS } from './data-source';
import { AuthorsRepository } from './repository/authors.repository';
import { BooksRepository } from './repository/books.repository';
import { GenresRepository } from './repository/genres.repository';
import { UsersRepository } from './repository/users.repository';
import { UsersGenresRepository } from './repository/users-genres.repository';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { UsersBooksRepository } from './repository/users-books.repository';

@Module({
  imports: [TypeOrmModule.forRoot(DB_OPTIONS)],
  providers: [
    AuthorsRepository,
    BooksRepository,
    GenresRepository,
    UsersRepository,
    UsersGenresRepository,
    DatabaseService,
    UsersBooksRepository,
  ],
  exports: [
    UsersRepository,
    UsersGenresRepository,
    GenresRepository,
    BooksRepository,
    DatabaseService,
    UsersBooksRepository,
  ],
  controllers: [DatabaseController],
})
export class DatabaseModule {}
