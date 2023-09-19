import TelegramBot from 'node-telegram-bot-api';
import { Helper } from '../templates/helper';
import { BotService } from './bot.service';
import { UsersService } from '../users/users.service';
import { UsersMessageController } from '../users/users-message.controller';
import { BooksQueryController } from '../books/books-query.controller';
import { BooksService } from '../books/books.service';

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
  };

  userInviteListener = async (
    msg: TelegramBot.Message,
    match: RegExpExecArray | null,
  ) => {
    if (!match) return;
    const {
      chatId,
      userId,
      userName = 'Anonymous',
    } = this.helper.getUserPoints(msg);

    if (!userId) {
      return this.botService.sendMessage(
        chatId,
        'Вашего аккаунта не существует',
      );
    }
    await this.usersService.userRegistration({ userId, chatId, userName });
    const friendId: number = +match[1].split('id')[1];
    return this.usersService.addFriend(userId, friendId);
  };
}
