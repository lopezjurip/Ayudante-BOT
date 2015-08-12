/// <reference path="../../typings/node-telegram-bot-api/TelegramBot.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TelegramBot = require("node-telegram-bot-api");
exports.t = require('./telegram-bot-typings');
var TelegramTypedBot = (function (_super) {
    __extends(TelegramTypedBot, _super);
    function TelegramTypedBot(token, server) {
        _super.call(this, token, { webHook: { port: server.port, host: server.host } });
        this.setWebHook(server.domain + ':443/bot' + token);
        this.commands = {};
        this.onCommand('/help', this.help);
        this.on('text', this.onText);
    }
    TelegramTypedBot.prototype.onText = function (msg) {
        var text = msg.text.trim();
        var isCommand = msg.text.lastIndexOf('/', 0) === 0;
        if (isCommand) {
            var command = text.split(' ')[0];
            var args = text.replace(command, '').trim();
            if (this.commands[command]) {
                this.commands[command](msg, args);
            }
            else if (this.onMissingAction) {
                this.onMissingAction(msg, args);
            }
            else {
                this.sendMessage(msg.chat.id, "Command '" + command + "' not available.\nSee: /help");
            }
        }
        else if (this.onPlainTextAction) {
            this.onPlainTextAction(msg);
        }
    };
    TelegramTypedBot.prototype.onCommand = function (command, action) {
        this.commands[command] = action;
        console.log('Registered command:', command);
    };
    TelegramTypedBot.prototype.help = function (msg, arg) {
    };
    return TelegramTypedBot;
})(TelegramBot);
exports.TelegramTypedBot = TelegramTypedBot;
