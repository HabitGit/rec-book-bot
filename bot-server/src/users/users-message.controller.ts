import TelegramBot from 'node-telegram-bot-api';
import { Helper } from '../templates/helper';
import { BotService } from '../bot/bot.service';
import { UsersService } from './users.service';

export class UsersMessageController {
  constructor(
    private botService: BotService,
    private usersService: UsersService,
    private helper: Helper,
  ) {}

  profileListener = async (msg: TelegramBot.Message) => {
    const { chatId, userId, message } = this.helper.getUserPoints(msg);

    switch (message) {
      case 'Мои книги':
        return this.usersService.getMyBooks(userId!, chatId);

      case 'Мои друзья':
        return this.usersService.getMyFriends(userId!, chatId);

      case 'Назад':
        await this.botService.messageListenerOff(this.profileListener);
        return this.botService.sendMessage(chatId, `Главное меню:`, {
          reply_markup: {
            keyboard: [[{ text: 'Подборка книг' }, { text: 'Профиль' }]],
            resize_keyboard: true,
          },
          parse_mode: 'Markdown',
        });
    }
  };
}
