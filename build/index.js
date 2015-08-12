var ayudante_bot_1 = require('./ayudante-bot');
var PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT;
var TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
var HOST = process.env.OPENSHIFT_NODEJS_IP || process.env.LOCAL_IP;
var DOMAIN = process.env.OPENSHIFT_APP_DNS || process.env.LOCAL_URL;
var options = {
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
};
var bot = new ayudante_bot_1.AyudanteBOT(options);
bot.getMe().then(function (me) {
    console.log('Bot successfully deployed!');
    console.log("Bot info:\n    - ID: " + me.id + "\n    - Name: " + me.first_name + "\n    - Username: " + me.username);
    console.log("Server info:\n    - Host: " + options.server.host + "\n    - Port: " + options.server.port + "\n    - Domain: " + options.server.domain);
});
bot.onCommand('/syllabus', function (msg, arg) {
    bot.sendMessage(msg.chat.id, "El syllabus est\u00E1 en: \n" + bot.syllabusUrl);
});
bot.onCommand('/private', function (msg, arg) {
    bot.sendMessage(msg.chat.id, "El repositorio privado est\u00E1 en: \n" + bot.privateUrl);
});
