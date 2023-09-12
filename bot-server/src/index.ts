import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import * as path from 'path';

const envPath: string = path.join(__dirname + '/../../.env');
config({
  path: envPath,
});

const TOKEN: string | undefined = process.env.TOKEN;
if (!TOKEN) throw new Error('Нету токена');

const Bot: TelegramBot = new TelegramBot(TOKEN, { polling: true });

Bot.on('message', async (msg) => {
  await Bot.sendMessage(msg.chat.id, 'Hello!');
});
