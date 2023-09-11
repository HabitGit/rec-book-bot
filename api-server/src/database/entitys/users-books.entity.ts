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

  @ManyToOne(() => Users, (user) => user.userId)
  userId: number;

  @ManyToOne(() => Books, (book) => book.id)
  bookId: number;
}
