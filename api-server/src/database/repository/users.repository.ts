import { DataSource, Repository } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { CreateUserDto } from '../dto/users.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async createUser(userData: CreateUserDto): Promise<Users> {
    const isUser: Users | null = await this.findOne({
      where: { userId: userData.userId },
    });
    if (isUser) throw new Error('Такой юзер уже существует');
    return this.save(userData);
  }

  async getUser(userId: number): Promise<Users> {
    const isUser: Users | null = await this.findOne({
      where: { userId: userId },
    });
    if (!isUser) throw new Error('Юзер не зарегистрирован');
    return isUser;
  }

  async getFriends(userId: number): Promise<Users> {
    const isUser: Users | null = await this.findOne({
      relations: { friends: true },
      select: { friends: true },
      where: { userId: userId },
    });
    if (!isUser) throw new Error('Вы не зарегистрированы');
    return isUser;
  }

  async addFriend(userId: number, friendId: number): Promise<Users> {
    const isUser: Users | null = await this.findOne({
      relations: { friends: true },
      where: { userId: userId },
    });
    if (!isUser) throw new Error('Вы не зарегистрированы');
    const isFriend: Users | null = await this.findOne({
      where: { userId: friendId },
    });
    if (!isFriend) throw new Error('Друг не зарегистрирован');
    return this.save({
      ...isUser,
      friends: [...isUser.friends, isFriend],
    });
  }
}
