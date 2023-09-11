import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddFriendDto, CreateUserDto } from '../database/dto/users.dto';
import { UsersRepository } from '../database/repository/users.repository';
import { Users } from '../database/entitys/users.entity';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(userData: CreateUserDto): Promise<Users> {
    return this.usersRepository.createUser(userData);
  }

  async addFriend(friendsData: AddFriendDto) {
    if (friendsData.userId === friendsData.friendId) {
      throw new HttpException(
        'Вы не можете добавить сами себя',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersRepository.addFriend(friendsData);
  }

  async getProfile(userId: number): Promise<Users> {
    return await this.usersRepository.getUser(userId);
  }
}
