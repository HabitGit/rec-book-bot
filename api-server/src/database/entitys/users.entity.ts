import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersGenres } from './users-genres.entity';
import { UsersBooks } from './users-books.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'numeric',
    unique: true,
    nullable: false,
  })
  userId: number;

  @Column({
    type: 'numeric',
    unique: true,
    nullable: false,
  })
  chatId: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  inviteLink: string;

  @ManyToMany(() => Users)
  @JoinTable()
  friends: Users[];

  @OneToMany(() => UsersGenres, (userGenre) => userGenre.user)
  preferenceGenre: UsersGenres[];

  @OneToMany(() => UsersBooks, (userBook) => userBook.user)
  likes: UsersBooks[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
