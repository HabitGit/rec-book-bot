import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}