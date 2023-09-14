import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersBooks } from '../entitys/users-books.entity';
import { Users } from '../entitys/users.entity';
import { Books } from '../entitys/books.entity';

@Injectable()
export class UsersBooksRepository extends Repository<UsersBooks> {
  constructor(private dataSource: DataSource) {
    super(UsersBooks, dataSource.createEntityManager());
  }

  async addLikeByBook(user: Users, book: Books, preference: boolean) {
    await this.save({
      user,
      book,
      preference,
    });
  }
}
