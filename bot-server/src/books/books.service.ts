import axios from 'axios';
import { BotService } from '../bot/bot.service';

const API_LINK = 'http://api-server:3000';

export class BooksService {
  constructor(private botService: BotService) {}

  async getBookById(bookId: number, chatId: number) {
    try {
      const { data: book } = await axios.get(`${API_LINK}/books/${bookId}`);

      return this.botService.sendPhoto(chatId!, book.pictures, {
        caption: `***${book.title} ${book.date} года***\n[Литрес](${book.url})`,
        parse_mode: 'Markdown',
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getBookByGenre(genreId: number, userId: number, chatId: number) {
    const { data: movie } = await axios.get(
      `${API_LINK}/books?page=0&size=1&genreId=${genreId}&userId=${userId}`,
    );

    if (movie[1] === 0) {
      return this.botService.sendMessage(chatId, 'В данном жанре нету книг');
    }

    await this.botService.sendPhoto(chatId!, movie[0][0].pictures, {
      caption: `***${movie[0][0].title} ${movie[0][0].date} года***\n[Литрес](${movie[0][0].url})`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'like',
              callback_data: `like,0,${movie[0][0].id},${genreId}`,
            },
            {
              text: 'dislike',
              callback_data: `dislike,0,${movie[0][0].id},${genreId}`,
            },
          ],
          [{ text: 'Вернуться к жанрам', callback_data: 'back' }],
        ],
      },
    });
  }

  async getMoreBooks(userId: number, chatId: number, page: number) {
    try {
      const { data: books } = await axios.get(
        `${API_LINK}/books/user/${userId}?page=${page}&size=10`,
      );

      const keyboard = [];
      for (const book of books[0]) {
        keyboard.push([
          { text: book.book.title, callback_data: `book,${book.book.id}` },
        ]);
      }
      if (keyboard.length === 10) {
        keyboard.push([{ text: 'Еще...', callback_data: `more,0` }]);
      }

      return this.botService.sendMessage(chatId!, 'Ваши книги', {
        reply_markup: {
          inline_keyboard: keyboard,
          resize_keyboard: true,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getGenresStartPage(chatId: number) {
    try {
      const { data: genres } = await axios.get(
        `${API_LINK}/books/genres?page=0&size=10`,
      );

      const keyboard = [];
      for (const genre of genres[0]) {
        keyboard.push([{ text: genre.name, callback_data: genre.id }]);
      }
      keyboard.push([{ text: 'Еще...', callback_data: `more0` }]);

      await this.botService.sendMessage(chatId, 'Выберите жанр', {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getMoreGenres(page: number, chatId: number, messageId: number) {
    const { data: genres } = await axios.get(
      `${API_LINK}/books/genres?page=${page}&size=10`,
    );

    const keyboard = [];
    for (const genre of genres[0]) {
      keyboard.push([{ text: genre.name, callback_data: genre.id }]);
    }
    if (page === 0 && genres[0].length === 10) {
      keyboard.push([{ text: 'Еще...', callback_data: `more${page}` }]);
    }
    if (page !== 0 && genres[0].length === 10) {
      keyboard.push([
        { text: 'Назад...', callback_data: `back${page - 1}` },
        { text: 'Еще...', callback_data: `more${page}` },
      ]);
    }
    if (page === Math.floor(genres[1] / 10)) {
      keyboard.push([{ text: 'Назад...', callback_data: `back${page - 1}` }]);
    }

    await this.botService.deleteMessage(chatId!, messageId);

    await this.botService.sendMessage(chatId, 'Выберите жанр', {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  async addLikeOrDislike(
    page: number,
    genreId: number,
    userId: number,
    chatId: number,
    bookId: number,
    likeType: boolean,
    messageId: number,
  ) {
    try {
      await axios.post(`${API_LINK}/books/${bookId}`, {
        type: likeType,
        userId: userId,
      });

      const { data: movie } = await axios.get(
        `${API_LINK}/books?page=${page}&size=1&genreId=${genreId}&userId=${userId}`,
      );

      console.log('PAGE: ', page);
      console.log('MOVIE COUNT: ', movie[1]);

      const callbackDataLike =
        page === +movie[1] - 1
          ? 'final'
          : `like,${+page!},${movie[0][0].id},${genreId}`;
      const callbackDataDislike =
        page === +movie[1] - 1
          ? 'final'
          : `dislike,${+page!},${movie[0][0].id},${genreId}`;

      await this.botService.sendPhoto(chatId!, movie[0][0].pictures, {
        caption: `***${movie[0][0].title} ${movie[0][0].date} года***\n[Литрес](${movie[0][0].url})`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'like',
                callback_data: callbackDataLike,
              },
              {
                text: 'dislike',
                callback_data: callbackDataDislike,
              },
            ],
            [{ text: 'Вернуться к жанрам', callback_data: 'back' }],
          ],
        },
      });
      await this.botService.deleteMessage(chatId, messageId);
    } catch (e) {
      console.log(e);
    }
  }

  getRandomBooks() {

  }
}
