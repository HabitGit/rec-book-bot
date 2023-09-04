import {Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Authors} from "./authors.entity";

@Entity()
export class Books {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'numeric',
        unique: true,
        nullable: false,
    })
    litresId: number;

    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    title: string;

    @Column({
        type: 'integer',
        nullable: true,
    })
    date: number;

    @Column({
        type: 'varchar',
        unique: true,
        nullable: true,
    })
    url: string;

    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    pictures: string;

    @Column({
        type: 'integer',
        nullable: false,
    })
    genreId: number;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    description: string;

    @ManyToMany(() => Authors)
    @JoinColumn()
    authors: Authors[];
}