/// <reference path="../typings/node-telegram-bot-api/TelegramBot.d.ts"/>

import {TelegramTypedBot as Bot, IServerOptions, BotAction, t} from './bot/telegram-typed-bot';

const PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT; // do not choose 443
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const HOST = process.env.OPENSHIFT_NODEJS_IP || process.env.LOCAL_IP; // whitout port
const DOMAIN = process.env.OPENSHIFT_APP_DNS || process.env.LOCAL_URL; // whitout http

const server: IServerOptions = {
  host: HOST,
  port: PORT,
  domain: DOMAIN,
}

const bot = new Bot(TELEGRAM_TOKEN, server);

bot.getMe().then(me => {
  console.log('Bot successfully deployed!')
  console.log(
    `Bot info:
    - ID: ${me.id}
    - Name: ${me.first_name}
    - Username: ${me.username}`
  );
  console.log(
    `Server info:
    - Host: ${server.host}
    - Port: ${server.port}
    - Domain: ${server.domain}`
  );
});

bot.onCommand('/hello', (msg: t.Message, arg?: string) => {
  bot.sendMessage(msg.chat.id,
    `Hello world`
  );
});

bot.onPlainTextAction = (msg: t.Message, arg?: string) => {
  // echo
  bot.sendMessage(msg.from.id,
    msg.text
  );
}
