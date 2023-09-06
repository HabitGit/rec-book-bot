import { DataSource, Repository } from 'typeorm';
import { Books } from '../entitys/books.entity';
import { CreateBookDto, UpdateBookDto } from '../dto/books.dto';

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
}
