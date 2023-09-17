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
    const isLike: UsersBooks | null = await this.findOne({
      where: {
        user: { id: user.id },
        book: { id: book.id },
      },
    });
    if (isLike) {
      return this.save({
        ...isLike,
        preference: preference,
      });
    }
    return this.save({
      user,
      book,
      preference,
    });
  }

  async getLikesBooks(userId: number, params: { take: number; skip: number }) {
    const { take, skip } = params;
    return this.findAndCount({
      relations: { book: true },
      where: {
        preference: true,
        user: { userId: userId },
      },
      take,
      skip,
    });
  }
}
