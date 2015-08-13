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
    - Domain: ${options.server.domain}
    - Tmp: ${process.env.OPENSHIFT_TMP_DIR}`
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

bot.onCommand('/publicar_actividad', (msg: t.Message, arg: string = '') => {
    if (arg == '') {
        bot.sendMessage(msg.chat.id,
            `Debes especificar el número de la AC como parámetro.`
        );
    } else {
        const number = parseInt(arg, 10);
        bot.sendMessage(msg.chat.id,
            `Publicando en: ${bot.syllabusUrl}/tree/master/Actividades/AC${(number < 10) ? '0' + number : number} ...`
        );
        bot.publishActivity(number).then(url => {
            bot.sendMessage(msg.chat.id,
                `Éxito! Commit: ${url}`
            );
        }).catch(err => {
            console.log(err)
            bot.sendMessage(msg.chat.id,
                `Error: ${err}`
            );
        })
    }
})

bot.onCommand('/publicar_tarea', (msg: t.Message, arg: string = '') => {
    if (arg == '') {
        bot.sendMessage(msg.chat.id,
            `Debes especificar el número de la T como parámetro.`
        );
    } else {
        const number = parseInt(arg, 10);
        bot.sendMessage(msg.chat.id,
            `Publicando en: ${bot.syllabusUrl}/tree/master/Tareas/T${(number < 10) ? '0' + number : number} ...`
        );
        bot.publishHomework(number).then(url => {
            bot.sendMessage(msg.chat.id,
                `Éxito! Commit: ${url}`
            );
        }).catch(err => {
            console.log(err)
            bot.sendMessage(msg.chat.id,
                `Error: ${err}`
            );
        })
    }
})

bot.onCommand('/recolectar_actividad', (msg: t.Message, arg: string = '') => {
    
})

bot.onCommand('/recolectar_tarea', (msg: t.Message, arg: string = '') => {

})

bot.onCommand('/echo_from', (msg: t.Message, arg: string = '') => {
    bot.sendMessage(msg.chat.id,
        JSON.stringify(msg.from)
    );
})

bot.onCommand('/echo_chat', (msg: t.Message, arg: string = '') => {
    bot.sendMessage(msg.chat.id,
        JSON.stringify(msg.chat)
    );
})
