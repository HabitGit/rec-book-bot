import TelegramBot from 'node-telegram-bot-api';
import { ConfigEnv } from '../config/config-env';

export class BotService extends TelegramBot {
  constructor(private readonly configService: ConfigEnv) {
    super(configService.get('TOKEN'), { polling: true });
    console.log('Bot was started...');
  }

  async inviteListener(
    calback: (msg: TelegramBot.Message, match: RegExpExecArray | null) => void,
  ) {
    return this.onText(/\/start (.+)/, calback);
  }

  async messageListenerOn(
    listener: (
      message: TelegramBot.Message,
      metadata: TelegramBot.Metadata,
    ) => void,
  ) {
    return this.on('message', listener);
  }

  async messageListenerOff(
    listener: (
      message: TelegramBot.Message,
      metadata: TelegramBot.Metadata,
    ) => void,
  ) {
    return this.removeListener('message', listener);
  }
}
