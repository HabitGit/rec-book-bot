import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Books} from "./books.entity";

@Entity()
export class Authors {
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
        nullable: false,
    })
    firstName: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    lastName: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    fullName: string;

    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    url: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    pictures: string;

    @ManyToMany(() => Books)
    books: Books[];
}