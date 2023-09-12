import TelegramBot from 'node-telegram-bot-api';
import { Helper } from '../../templates/helper';
import { BotService } from '../bot.service';
import axios from 'axios';
import { UsersService } from '../../users/users.service';

const API_LINK = 'http://localhost:3000';

export class MessageController {
  constructor(
    private helper: Helper,
    private botService: BotService,
    private usersService: UsersService,
  ) {}

  requestHandler = async (msg: TelegramBot.Message) => {
    const {
      chatId,
      userName = 'Anonymous',
      userId,
      message,
    } = this.helper.getUserPoints(msg);

    if (!userId) {
      return this.botService.sendMessage(
        chatId,
        'Вашего аккаунта не существует',
      );
    }
    switch (message) {
      case '/start':
        // Проверяем юзера
        try {
          const isUser = await this.usersService.checkUser(userId);
          if (isUser) {
            return this.botService.sendMessage(
              chatId,
              `С возвращением ${userName}`,
              {
                reply_markup: {
                  keyboard: [[{ text: 'Подборка книг' }, { text: 'Профиль' }]],
                  resize_keyboard: true,
                },
                parse_mode: 'Markdown',
              },
            );
          }

          const inviteLink = `https://t.me/${process.env.BOT_NAME}?start=id${userId}`;
          const userData = {
            userId: userId,
            chatId: chatId,
            name: userName,
            inviteLink: inviteLink,
          };
          await axios.post(`${API_LINK}/users/registration`, userData);
          return this.botService.sendMessage(
            chatId,
            `Добро пожаловать ${userName}!`,
            {
              reply_markup: {
                keyboard: [[{ text: 'Подборка книг' }, { text: 'Профиль' }]],
                resize_keyboard: true,
              },
              parse_mode: 'Markdown',
            },
          );
        } catch (e) {
          console.log('[-]Mess.controller, start', e);
        }
        break;

      case 'Профиль':
        try {
          const profile = await axios.post(
            `${API_LINK}/users/profile/${userId}`,
            { type: 'profile' },
          );
          console.log('Profile: ', profile.data);
          return this.botService.sendMessage(
            chatId,
            `***Мой профиль:***\nИмя: ${profile.data.name}.\nЛюбимый жанр: ${
              profile.data.preferenceGenre.length > 0
                ? profile.data.preferenceGenre
                : 'еще нету'
            }.\n[Инвайт ссылка](${profile.data.inviteLink})`,
            {
              reply_markup: {
                keyboard: [[{ text: 'Мои книги' }, { text: 'Мои друзья' }]],
                resize_keyboard: true,
              },
              parse_mode: 'Markdown',
              disable_web_page_preview: true,
            },
          );
        } catch (e) {
          console.log(e);
        }
        break;

      case 'Мои книги':
        try {
          const books = await axios.post(
            `${API_LINK}/users/profile/${userId}`,
            { type: 'books' },
          );
          console.log('BOOKS: ', books);
          if (books.data.likes.length === 0) {
            return this.botService.sendMessage(
              chatId,
              'Еще нет ни одной книги',
            );
          }
          for (const book of books.data.likes) {
            console.log(book);
            /**
             * Тут будет код перечисления книг. Нужна пагинация;
             */
          }
        } catch (e) {
          console.log(e);
        }
        break;

      case '':
        console.log('Заглушка');
        break;
    }

    await this.botService.inviteListener(
      (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
        if (!match) return;
        console.log('match: ', match[1]);
      },
    );
  };
}
