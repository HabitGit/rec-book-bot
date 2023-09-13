import { Injectable } from '@nestjs/common';
import { BooksRepository } from '../database/repository/books.repository';

@Injectable()
export class BooksService {
  constructor(private booksRepository: BooksRepository) {}
  async getGenres() {
    return [];
  }
}
