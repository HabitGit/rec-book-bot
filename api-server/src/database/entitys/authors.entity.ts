import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
