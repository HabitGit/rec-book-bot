import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const TOKEN: string | undefined = process.env.TOKEN;
if (!TOKEN) throw new Error('Нету токена');

const Bot: TelegramBot = new TelegramBot(TOKEN, { polling: true });

Bot.on('message', async (msg) => {
    await Bot.sendMessage(msg.chat.id, 'Hello!');
})