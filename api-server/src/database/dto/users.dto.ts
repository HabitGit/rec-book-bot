import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  userId: number;
  @IsInt()
  chatId: number;
  @IsString()
  name: string;
  @IsString()
  inviteLink: string;
}

export class AddFriendDto {
  @IsInt()
  userId: number;
  @IsInt()
  friendId: number;
}

export class UserProfileDto {
  @IsString()
  name: string;
  @IsString()
  preferenceGenre: string;
  @IsString()
  inviteLink: string;
}
