import { GenreType } from './types';

export interface IUserRegistrationData {
  userId: number;
  chatId: number;
  name: string;
  inviteLink: string;
}

export interface IGenreData {
  id: number;
  preferenceLevel: number;
  genre: GenreType;
}

export interface IFriend {
  id: number;
  userId: string;
  chatId: string;
  name: string;
  inviteLink: string;
  createdAt: string;
  updateAt: string;
};
