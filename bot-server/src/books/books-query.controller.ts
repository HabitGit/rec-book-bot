import { Helper } from '../templates/helper';
import TelegramBot from 'node-telegram-bot-api';
import { BooksService } from './books.service';
import { BotService } from '../bot/bot.service';

export class BooksQueryController {
  constructor(
    private helper: Helper,
    private booksService: BooksService,
    private botService: BotService,
  ) {}

  myBooksListener = async (query: TelegramBot.CallbackQuery) => {
    const { data, chatId, userId } = this.helper.getUserPointsQuery(query);

    switch (data?.slice(0, 4)) {
      case 'book':
        const bookId: number = +data?.split(',')[1];
        return this.booksService.getBookById(bookId, chatId!);

      case 'more':
        const page: number = +data?.split(',')[1] + 1;
        return this.booksService.getMoreBooks(userId, chatId!, page);
    }
  };

  getGenresListener = async (query: TelegramBot.CallbackQuery) => {
    const { data, chatId, userId } = this.helper.getUserPointsQuery(query);

    if (data?.slice(0, 4) === 'more') {
      const page: number = +data.slice(4) + 1;
      return this.booksService.getMoreGenres(
        page,
        chatId!,
        query.message!.message_id,
      );
    } else if (data?.slice(0, 4) === 'back') {
      const page: number = +data.slice(4);
      return this.booksService.getMoreGenres(
        page,
        chatId!,
        query.message!.message_id,
      );
    } else {
      await this.botService.queryListenerOff(this.getGenresListener);
      const genreId: number = +data!;
      await this.botService.deleteMessage(chatId!, query.message!.message_id);
      await this.booksService.getBookByGenre(genreId, userId, chatId!);
      return this.botService.queryListenerOn(this.getLikeListener);
    }
  };

  getLikeListener = async (query: TelegramBot.CallbackQuery) => {
    const { data, chatId, userId } = this.helper.getUserPointsQuery(query);

    const like = data?.split(',')[0],
      page = data?.split(',')[1],
      bookId = +data!.split(',')[2],
      genreId = +data!.split(',')[3];

    const nextPage: number = +page! + 1;

    switch (like) {
      case 'like':
        return this.booksService.addLikeOrDislike(
          nextPage,
          genreId,
          userId,
          chatId!,
          bookId,
          true,
          query.message!.message_id,
        );

      case 'dislike':
        return this.booksService.addLikeOrDislike(
          nextPage,
          genreId,
          userId,
          chatId!,
          bookId,
          false,
          query.message!.message_id,
        );

      case 'back':
        await this.botService.queryListenerOff(this.getGenresListener);
        await this.booksService.getGenresStartPage(chatId!);
        return this.botService.queryListenerOn(this.getGenresListener);

      case 'final':
        await this.botService.queryListenerOff(this.getLikeListener);
        await this.botService.sendMessage(
          chatId!,
          'Больше нету фильмов данного жанра',
        );
        break;
    }
  };
}
