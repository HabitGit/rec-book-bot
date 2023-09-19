import { config } from 'dotenv';
import * as path from 'path';
import { BotService } from './bot/bot.service';
import { Commands } from './bot/commands';
import { ConfigEnv } from './config/config-env';
import { BotMessageController } from './bot/bot-message.controller';
import { Helper } from './templates/helper';
import { UsersService } from './users/users.service';
import { BooksService } from './books/books.service';
import { UsersMessageController } from './users/users-message.controller';
import { BooksQueryController } from './books/books-query.controller';

const envPath: string = path.join(__dirname + '/../../.env');
config({
  path: envPath,
});

export class Main {
  constructor(
    private botService: BotService,
    private messageController: BotMessageController,
  ) {}

  async botOn() {
    await this.botService.setMyCommands(Commands);

    await this.botService.messageListenerOn(
      this.messageController.requestHandler,
    );
    await this.botService.inviteListener(
      this.messageController.userInviteListener,
    );
  }
}

const helper = new Helper();
const configService = new ConfigEnv();
const botService = new BotService(configService);
const booksService = new BooksService(botService);
const booksQueryController = new BooksQueryController(
  helper,
  booksService,
  botService,
);
const usersService = new UsersService(botService, booksQueryController);
const usersMessageController = new UsersMessageController(
  botService,
  usersService,
  helper,
);
const botMessageController = new BotMessageController(
  helper,
  botService,
  usersService,
  booksService,
  usersMessageController,
  booksQueryController,
);
const main = new Main(botService, botMessageController);

main.botOn();
