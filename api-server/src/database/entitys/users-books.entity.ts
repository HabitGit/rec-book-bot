import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users.entity';
import { Books } from './books.entity';

@Entity()
export class UsersBooks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  preference: boolean;

  @ManyToOne(() => Users, (user) => user.likes)
  user: Users;

  @ManyToOne(() => Books, (book) => book.users)
  book: Books;
}
