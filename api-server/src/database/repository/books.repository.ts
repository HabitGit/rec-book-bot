import { DataSource, Repository } from 'typeorm';
import { Books } from '../entitys/books.entity';
import { CreateBookDto, FindOptionsDto, UpdateBookDto } from '../dto/books.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksRepository extends Repository<Books> {
  constructor(private dataSource: DataSource) {
    super(Books, dataSource.createEntityManager());
  }

  async createBook(bookData: CreateBookDto): Promise<Books> {
    const isBook: Books | null = await this.findOne({
      where: { litresId: bookData.litresId },
    });
    if (isBook) throw new Error('Такая книга уже существует');
    return this.save(bookData);
  }

  async updateBook(updateBookData: UpdateBookDto) {
    const isBook: Books | null = await this.findOne({
      relations: { authors: true },
      where: { litresId: updateBookData.litresId },
    });
    if (!isBook) throw new Error('Такой книги нету');
    return this.save({
      ...updateBookData,
      authors: updateBookData.authors
        ? [...isBook.authors, ...updateBookData.authors]
        : [...isBook.authors],
    });
  }

  async getBooks(findOptions: FindOptionsDto): Promise<[Books[], number]> {
    const { take, skip, genreId, id } = findOptions;
    return this.findAndCount({
      take,
      skip,
      where: {
        genreId,
        id,
      },
    });
  }
}
