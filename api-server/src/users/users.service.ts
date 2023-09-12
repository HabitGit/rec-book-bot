import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AddFriendDto,
  CreateUserDto,
  ProfileTypeEnum,
  ProfileTypeDto,
} from '../database/dto/users.dto';
import { UsersRepository } from '../database/repository/users.repository';
import { Users } from '../database/entitys/users.entity';
import { GenresRepository } from '../database/repository/genres.repository';
import { UsersGenresRepository } from '../database/repository/users-genres.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private genresRepository: GenresRepository,
    private usersGenresRepository: UsersGenresRepository,
  ) {}

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

  async getProfile(userId: number, profileData: ProfileTypeDto) {
    switch (profileData.type) {
      case ProfileTypeEnum.profile:
        return this.usersRepository.getUserProfile(userId);
      case ProfileTypeEnum.books:
        return this.usersRepository.getUserLikesBooks(userId);
      case ProfileTypeEnum.friends:
        return this.usersRepository.getUserFriends(userId);
    }
  }
}
