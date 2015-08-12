import {AyudanteBOT, AyudanteBOTOptions, t} from './ayudante-bot';

const PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT; // do not choose 443
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HOST = process.env.OPENSHIFT_NODEJS_IP || process.env.LOCAL_IP; // whitout port
const DOMAIN = process.env.OPENSHIFT_APP_DNS || process.env.LOCAL_URL; // whitout http

const options: AyudanteBOTOptions = {
    github: 'mrpatiwi',
    tokens: {
        telegram: TELEGRAM_TOKEN,
        github: GITHUB_TOKEN,
    },
    server: {
        host: HOST,
        port: PORT,
        domain: DOMAIN,
    }
}

const bot = new AyudanteBOT(options);

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
    - Host: ${options.server.host}
    - Port: ${options.server.port}
    - Domain: ${options.server.domain}`
    );
});

bot.onCommand('/syllabus', (msg: t.Message, arg?: string) => {
    bot.sendMessage(msg.chat.id,
        `El syllabus está en: \n${bot.syllabusUrl}`
    );
})

bot.onCommand('/private', (msg: t.Message, arg?: string) => {
    bot.sendMessage(msg.chat.id,
        `El repositorio privado está en: \n${bot.privateUrl}`
    );
})
