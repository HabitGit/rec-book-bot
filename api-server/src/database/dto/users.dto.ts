import { IsEnum, IsInt, IsString } from 'class-validator';

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

export enum ProfileTypeEnum {
  profile = 'profile',
  books = 'books',
  friends = 'friends',
}

export class ProfileTypeDto {
  @IsEnum(ProfileTypeEnum)
  type: ProfileTypeEnum;
}
