import { config } from 'dotenv';
import * as path from 'path';
import { BotService } from './bot/bot.service';
import { Commands } from './bot/commands';
import { ConfigEnv } from './config/config-env';
import { MessageController } from './bot/controllers/message-controller';
import { Helper } from './templates/helper';
import { UsersService } from './users/users.service';

const envPath: string = path.join(__dirname + '/../../.env');
config({
  path: envPath,
});

export class Main {
  constructor(
    private botService: BotService,
    private messageController: MessageController,
  ) {}

  async botOn() {
    await this.botService.setMyCommands(Commands);
    await this.botService.messageListenerOn(
      this.messageController.requestHandler,
    );
  }
}

const helper = new Helper();
const configService = new ConfigEnv();
const botService = new BotService(configService);
const usersService = new UsersService();
const messageController = new MessageController(
  helper,
  botService,
  usersService,
);
const main = new Main(botService, messageController);

main.botOn();
