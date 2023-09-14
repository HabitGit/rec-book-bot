import TelegramBot from 'node-telegram-bot-api';
import { Helper } from '../../templates/helper';
import { BotService } from '../bot.service';
import axios from 'axios';
import { UsersService } from '../../users/users.service';

// const API_LINK = 'http://localhost:3000';
const API_LINK = 'http://api-server:3000';

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
                keyboard: [
                  [{ text: 'Мои книги' }, { text: 'Мои друзья' }],
                  [{ text: 'Назад' }],
                ],
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

      case 'Мои друзья':
        const friends = await axios.post(
          `${API_LINK}/users/profile/${userId}`,
          {
            type: 'friends',
          },
        );
        console.log('Friends: ', friends);
        if (friends.data.friends.length === 0) {
          return this.botService.sendMessage(
            chatId,
            'Вы еще не добавили друзей',
          );
        }
        for (const friend of friends.data.friends) {
          console.log(friend);
          /**
           * Тут будет код с друзьями
           */
        }
        break;

      case 'Назад':
        return this.botService.sendMessage(chatId, `Главное меню:`, {
          reply_markup: {
            keyboard: [[{ text: 'Подборка книг' }, { text: 'Профиль' }]],
            resize_keyboard: true,
          },
          parse_mode: 'Markdown',
        });

      case 'Подборка книг':
        const genres = await axios.get(
          `${API_LINK}/books/genres?page=0&size=10`,
        );

        const keyboard = [];
        for (const genre of genres.data) {
          keyboard.push([{ text: genre.name, callback_data: genre.id }]);
        }
        keyboard.push([{ text: 'Еще...', callback_data: `more0` }]);

        await this.botService.sendMessage(chatId, 'Выберите жанр', {
          reply_markup: {
            inline_keyboard: keyboard,
          },
        });
        await this.botService.queryListenerOn(this.getGenreListener);
        break;
    }

    await this.botService.inviteListener(
      (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
        if (!match) return;
        console.log('match: ', match[1]);
      },
    );
  };
  getGenreListener = async (query: TelegramBot.CallbackQuery) => {
    const { data, chatId, userId } = this.helper.getUserPointsQuery(query);

    if (data?.slice(0, 4) === 'more') {
      console.log('More work: ', data);
      const index: number = +data.slice(4, 5) + 1;
      const genres = await axios.get(
        `${API_LINK}/books/genres?page=${index}&size=10`,
      );

      const keyboard = [];
      for (const genre of genres.data) {
        keyboard.push([{ text: genre.name, callback_data: genre.id }]);
      }
      keyboard.push([{ text: 'Еще...', callback_data: `more${index}` }]);

      await this.botService.sendMessage(chatId!, 'Выберите жанр', {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      });
    } else {
      console.log('new query: ', query);
      const movie = await axios.get(
        `${API_LINK}/books?page=0&size=1&genreId=${data}&userId=${userId}`,
      );
      console.log('Movie pic: ', movie.data);
      await this.botService.sendPhoto(chatId!, movie.data[0][0].pictures, {
        caption: `***${movie.data[0][0].title} ${movie.data[0][0].date} года***\n[Литрес](${movie.data[0][0].url})`,
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'like', callback_data: `like,0,${data}` },
              { text: 'dislike', callback_data: `dislike,0,${data}` },
            ],
          ],
        },
      });
      await this.botService.queryListenerOn(this.getLikeListener);
      await this.botService.queryListenerOff(this.getGenreListener);
    }
  };

  getLikeListener = async (query: TelegramBot.CallbackQuery) => {
    const { data, chatId, userId } = this.helper.getUserPointsQuery(query);

    const like = data?.split(',')[0],
      page = data?.split(',')[1],
      genreId = data?.split(',')[2];

    switch (like) {
      case 'like':
        console.log('заглушка');
        break;
      case 'dislike':
        console.log('заглушка');
        break;
    }
  };
}
