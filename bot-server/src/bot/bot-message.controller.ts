import TelegramBot from 'node-telegram-bot-api';
import { Helper } from '../templates/helper';
import { BotService } from './bot.service';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { UsersMessageController } from '../users/users-message.controller';
import { BooksQueryController } from '../books/books-query.controller';
import { BooksService } from '../books/books.service';

const API_LINK = process.env.API_LINK;

export class BotMessageController {
  constructor(
    private helper: Helper,
    private botService: BotService,
    private usersService: UsersService,
    private booksService: BooksService,
    private usersMessageController: UsersMessageController,
    private booksQueryController: BooksQueryController,
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
        return this.usersService.userRegistration({ userId, chatId, userName });

      case '/profile':
      case 'Профиль':
        await this.usersService.getProfile({ userId, chatId });
        await this.botService.messageListenerOff(
          this.usersMessageController.profileListener,
        );
        return this.botService.messageListenerOn(
          this.usersMessageController.profileListener,
        );

      case 'Подборка книг':
        await this.botService.queryListenerOff(
          this.booksQueryController.getGenreListener,
        );
        await this.booksService.getGenresStartPage(chatId);
        return this.botService.queryListenerOn(
          this.booksQueryController.getGenreListener,
        );
    }

    await this.botService.inviteListener(
      async (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
        if (!match) return;
        console.log('match: ', match[1]);
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

          //Добавляем в друзья
          await axios.post(`${API_LINK}/users/profile/friends`, {
            userId: userId,
            friendId: +match[1].split('id')[1],
          });

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
      },
    );
  };
}
