import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./users.entity";
import {Genres} from "./genres.entity";

@Entity()
export class UsersGenres {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'integer',
        default: 20,
    })
    preferenceLevel: number;

    @ManyToOne(() => Users, (user) => user.userId)
    userId: number;

    @ManyToOne(() => Genres, (genre) => genre.id)
    genreId: number;
}