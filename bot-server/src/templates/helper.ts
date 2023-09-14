import TelegramBot from 'node-telegram-bot-api';

export class Helper {
  getUserPoints(msg: TelegramBot.Message) {
    return {
      chatId: msg.chat.id,
      userId: msg.from?.id,
      userName: msg.from?.first_name,
      message: msg.text,
    };
  }

  getUserPointsQuery(query: TelegramBot.CallbackQuery) {
    return {
      data: query.data,
      chatId: query.message?.chat.id,
      userId: query.from.id,
    };
  }
}
