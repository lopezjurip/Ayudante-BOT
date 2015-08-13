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
    console.log("Server info:\n    - Host: " + options.server.host + "\n    - Port: " + options.server.port + "\n    - Domain: " + options.server.domain + "\n    - Tmp: " + process.env.OPENSHIFT_TMP_DIR);
});
bot.onCommand('/syllabus', function (msg, arg) {
    bot.sendMessage(msg.chat.id, "El syllabus est\u00E1 en: \n" + bot.syllabusUrl);
});
bot.onCommand('/private', function (msg, arg) {
    bot.sendMessage(msg.chat.id, "El repositorio privado est\u00E1 en: \n" + bot.privateUrl);
});
bot.onCommand('/publicar_actividad', function (msg, arg) {
    if (arg === void 0) { arg = ''; }
    if (arg == '') {
        bot.sendMessage(msg.chat.id, "Debes especificar el n\u00FAmero de la AC como par\u00E1metro.");
    }
    else {
        var number = parseInt(arg, 10);
        bot.sendMessage(msg.chat.id, "Publicando en: " + bot.syllabusUrl + "/tree/master/Actividades/AC" + ((number < 10) ? '0' + number : number) + " ...");
        bot.publishActivity(number).then(function (url) {
            bot.sendMessage(msg.chat.id, "\u00C9xito! Commit: " + url);
        }).catch(function (err) {
            console.log(err);
            bot.sendMessage(msg.chat.id, "Error: " + err);
        });
    }
});
bot.onCommand('/publicar_tarea', function (msg, arg) {
    if (arg === void 0) { arg = ''; }
    if (arg == '') {
        bot.sendMessage(msg.chat.id, "Debes especificar el n\u00FAmero de la T como par\u00E1metro.");
    }
    else {
        var number = parseInt(arg, 10);
        bot.sendMessage(msg.chat.id, "Publicando en: " + bot.syllabusUrl + "/tree/master/Tareas/T" + ((number < 10) ? '0' + number : number) + " ...");
        bot.publishHomework(number).then(function (url) {
            bot.sendMessage(msg.chat.id, "\u00C9xito! Commit: " + url);
        }).catch(function (err) {
            console.log(err);
            bot.sendMessage(msg.chat.id, "Error: " + err);
        });
    }
});
bot.onCommand('/recolectar_actividad', function (msg, arg) {
    if (arg === void 0) { arg = ''; }
    if (arg == '') {
        bot.sendMessage(msg.chat.id, "Debes especificar el n\u00FAmero de la AC como par\u00E1metro.");
    }
    else {
        var number = parseInt(arg, 10);
        bot.recollectActivity(number).then(function (url) {
            bot.sendMessage(msg.chat.id, "\u00C9xito! Commit: " + url);
        }).catch(function (err) {
            console.log(err);
            bot.sendMessage(msg.chat.id, "Error: " + err);
        });
    }
});
bot.onCommand('/recolectar_tarea', function (msg, arg) {
    if (arg === void 0) { arg = ''; }
});
bot.onCommand('/echo_from', function (msg, arg) {
    if (arg === void 0) { arg = ''; }
    bot.sendMessage(msg.chat.id, JSON.stringify(msg.from));
});
bot.onCommand('/echo_chat', function (msg, arg) {
    if (arg === void 0) { arg = ''; }
    bot.sendMessage(msg.chat.id, JSON.stringify(msg.chat));
});
