import axios from 'axios';
import { BotService } from '../bot/bot.service';
import {
  MessageGenerator,
  MessageTypeEnum,
} from '../templates/messages.template';
import { Keyboard } from '../bot/keybords/keyboards';
import { IFriend, IGenreData, IUserRegistrationData } from '../templates/interfaces';
import TelegramBot from 'node-telegram-bot-api';
import { Helper } from '../templates/helper';

const API_LINK = 'http://api-server:3000';

export class UsersService {
  constructor(
    private botService: BotService,
    private helper: Helper,
  ) {}

  profileListener = async (msg: TelegramBot.Message) => {
    const {
      chatId,
      userName = 'Anonymous',
      userId,
      message,
    } = this.helper.getUserPoints(msg);

    switch (message) {
      case 'Мои книги':
        try {
          const { data: books } = await axios.post(
            `${API_LINK}/users/profile/${userId}`,
            { type: 'books' },
          );

          console.log('BOOKS: ', books);
          const noBooksMessage: string = MessageGenerator({
            type: MessageTypeEnum.noBooks,
          });

          if (books.likes.length === 0) {
            return this.botService.sendMessage(chatId, noBooksMessage);
          }

          for (const book of books.likes) {
            console.log('BOOK', book);
            /**
             * Тут будет код перечисления книг. Нужна пагинация;
             */
          }
        } catch (e) {
          console.log(e);
        }
        break;
      case 'Мои друзья':
        const friends = await axios.post(
          `${API_LINK}/users/profile/${userId}`,
          {
            type: 'friends',
          },
        );
        if (friends.data.friends.length === 0) {
          return this.botService.sendMessage(
            chatId,
            'Вы еще не добавили друзей',
          );
        }

        const friendsName = friends.data.friends.map((friend: IFriend) => {
          return friend.name;
        });
        return this.botService.sendMessage(
          chatId,
          `Ваши друзья:\n${friendsName.join('\n')}`,
        );
        break;
      case 'Назад':
        await this.botService.messageListenerOff(this.profileListener);
        return this.botService.sendMessage(chatId, `Главное меню:`, {
          reply_markup: {
            keyboard: [[{ text: 'Подборка книг' }, { text: 'Профиль' }]],
            resize_keyboard: true,
          },
          parse_mode: 'Markdown',
        });
        break;
    }
  };

  async userRegistration(data: {
    userId: number;
    chatId: number;
    userName: string;
  }) {
    const { userId, chatId, userName } = data;

    try {
      const isUser: boolean = await this.checkUser(userId);
      if (isUser) {
        const welcomeBackMessage: string = MessageGenerator({
          type: MessageTypeEnum.welcomeBack,
          userName,
        });
        return this.botService.sendMessage(chatId, welcomeBackMessage, {
          reply_markup: {
            keyboard: Keyboard.mainPage,
            resize_keyboard: true,
          },
          parse_mode: 'Markdown',
        });
      }
    } catch (e) {
      console.log('[-]Произошла ошибка при проверке юзера', e);
    }

    const inviteLink: string = `https://t.me/${process.env.BOT_NAME}?start=id${userId}`;
    const userRegistrationData: IUserRegistrationData = {
      userId: userId,
      chatId: chatId,
      name: userName,
      inviteLink: inviteLink,
    };
    const welcomeMessage: string = MessageGenerator({
      type: MessageTypeEnum.welcome,
      userName,
    });

    try {
      await axios.post(`${API_LINK}/users/registration`, userRegistrationData);
      return this.botService.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
          keyboard: Keyboard.mainPage,
          resize_keyboard: true,
        },
        parse_mode: 'Markdown',
      });
    } catch (e) {
      console.log('[-]Произошла ошибка при регистрации: ', e);
    }
  }

  async getProfile(data: { userId: number; chatId: number }) {
    try {
      const { data: profileData } = await axios.post(
        `${API_LINK}/users/profile/${data.userId}`,
        { type: 'profile' },
      );

      const favoriteGenre =
        profileData.preferenceGenre.length > 0
          ? profileData.preferenceGenre.reduce(
              (genre1: IGenreData, genre2: IGenreData) => {
                return genre1.preferenceLevel >= genre2.preferenceLevel
                  ? genre1
                  : genre2;
              },
            ).genre.name
          : 'Еще нету';

      const profileMessage: string = MessageGenerator({
        type: MessageTypeEnum.profileData,
        userName: profileData.name,
        genres: favoriteGenre,
        inviteLink: profileData.inviteLink,
      });

      return this.botService.sendMessage(data.chatId, profileMessage, {
        reply_markup: {
          keyboard: Keyboard.profilePage,
          resize_keyboard: true,
        },
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async checkUser(userId: number): Promise<boolean> {
    try {
      const { data: isUserData } = await axios.post(
        `${API_LINK}/users/profile/${userId}`,
        {
          type: 'profile',
        },
      );
      if (isUserData) {
        return true;
      }
    } catch (e) {
      if (
        axios.isAxiosError(e) &&
        e.message === 'Request failed with status code 401'
      ) {
        return false;
      }
      console.log('[-]*UsersService*CheckUser*Неизвестная ошибка: ', e);
      throw new Error(`Неизвестная ошибка: ${e}`);
    }
    return false;
  }
}
