import { DataSource, Repository } from 'typeorm';
import { Users } from '../entitys/users.entity';
import { AddFriendDto, CreateUserDto } from '../dto/users.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async createUser(userData: CreateUserDto): Promise<Users> {
    const isUser: Users | null = await this.findOne({
      where: { userId: userData.userId },
    });
    if (isUser)
      throw new HttpException(
        'Такой юзер уже существует',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    try {
      const newUser: Users = await this.save(userData);
      return newUser;
    } catch (e) {
      throw new HttpException(
        `Невалидные данные: ${e.message.slice(0, 25)}...`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserProfile(userId: number): Promise<Users> {
    const isUser: Users | null = await this.findOne({
      relations: { preferenceGenre: { genre: true } },
      where: {
        userId: userId,
      },
    });
    if (!isUser) {
      throw new HttpException(
        'Юзер не зарегистрирован',
        HttpStatus.UNAUTHORIZED,
      );
    }
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

  async addFriend(friendsData: AddFriendDto): Promise<Users> {
    const isUser: Users | null = await this.findOne({
      relations: { friends: true },
      where: { userId: friendsData.userId },
    });
    if (!isUser)
      throw new HttpException(
        'Вы не зарегистрированы',
        HttpStatus.UNAUTHORIZED,
      );

    const isFriend: Users | null = await this.findOne({
      relations: { friends: true },
      where: { userId: friendsData.friendId },
    });
    if (!isFriend)
      throw new HttpException(
        'Друг не зарегистрирован',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    await this.save({
      ...isFriend,
      friends: [...isFriend.friends, isUser],
    });
    return this.save({
      ...isUser,
      friends: [...isUser.friends, isFriend],
    });
  }

  async getUserLikesBooks(userId: number) {
    const isUser: Users | null = await this.findOne({
      relations: { likes: true },
      where: {
        userId: userId,
      },
    });
    if (!isUser) {
      throw new HttpException(
        'Юзер не зарегистрирован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return isUser;
  }

  async getUserFriends(userId: number) {
    const isUser: Users | null = await this.findOne({
      relations: { friends: true },
      where: {
        userId: userId,
      },
    });
    if (!isUser) {
      throw new HttpException(
        'Юзер не зарегистрирован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return isUser;
  }
}
