import { KeyboardButton } from 'node-telegram-bot-api';

export type Buttons = {
  [pageName: string]: { [buttonName: string]: KeyboardButton };
};

export type KeyboardType = {
  mainPage: KeyboardButton[][];
  profilePage: KeyboardButton[][];
};

export type GenreType = {
  id: number;
  name: string;
  genreCod: string;
};
