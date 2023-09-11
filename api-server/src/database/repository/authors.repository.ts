import { Authors } from '../entitys/authors.entity';
import { CreateAuthorDto } from '../dto/authors.dto';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorsRepository extends Repository<Authors> {
  constructor(private dataSource: DataSource) {
    super(Authors, dataSource.createEntityManager());
  }

  async createAuthor(authorData: CreateAuthorDto): Promise<Authors> {
    const isAuthor: Authors | null = await this.findOne({
      where: { litresId: authorData.litresId },
    });
    if (isAuthor) throw new Error('Такой автор уже существует');
    return this.save(authorData);
  }
}
