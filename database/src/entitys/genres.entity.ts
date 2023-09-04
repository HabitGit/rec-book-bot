import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}