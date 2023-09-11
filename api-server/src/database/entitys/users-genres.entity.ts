import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users.entity';
import { Genres } from './genres.entity';

@Entity()
export class UsersGenres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    default: 20,
  })
  preferenceLevel: number;

  @ManyToOne(() => Users, (user) => user.preferenceGenre)
  user: Users;

  @ManyToOne(() => Genres, (genre) => genre.preferenceUser)
  genre: Genres;
}
