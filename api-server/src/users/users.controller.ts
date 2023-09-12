import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AddFriendDto,
  CreateUserDto,
  ProfileTypeDto,
} from '../database/dto/users.dto';
import { Users } from '../database/entitys/users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/registration')
  async createUser(
    @Body(ValidationPipe) userData: CreateUserDto,
  ): Promise<Users> {
    return this.usersService.createUser(userData);
  }

  @Post('/profile/friends')
  async addFriend(
    @Body(ValidationPipe) friendsData: AddFriendDto,
  ): Promise<Users> {
    return this.usersService.addFriend(friendsData);
  }

  @Post('/profile/:id')
  async getProfileData(
    @Param('id', ParseIntPipe) userId: number,
    @Body(ValidationPipe) profileType: ProfileTypeDto,
  ) {
    return this.usersService.getProfile(userId, profileType);
  }
}
