import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersGenres } from './users-genres.entity';

@Entity()
export class Genres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  genreCod: string;

  @OneToMany(() => UsersGenres, (userGenre) => userGenre.genre)
  preferenceUser: UsersGenres[];
}
