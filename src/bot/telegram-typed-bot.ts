/// <reference path="../../typings/node-telegram-bot-api/TelegramBot.d.ts"/>

import TelegramBot = require("node-telegram-bot-api");
export import t = require('./telegram-bot-typings')

export interface IServerOptions {
    host: string
    port: number
    domain: string
}

export type BotAction = (Message, string?) => void

export class TelegramTypedBot extends TelegramBot {
    private commands: { [id: string]: BotAction }
    public onPlainTextAction: BotAction
    public onMissingAction: BotAction

    constructor(token: string, server: IServerOptions) {
        super(token, { webHook: { port: server.port, host: server.host } })
        this.setWebHook(server.domain + ':443/bot' + token)

        this.commands = {}
        this.onCommand('/help', this.help)

        this.on('text', this.onText)
    }

    private onText(msg: t.Message) {
        const text = msg.text.trim()

        const isCommand = msg.text.lastIndexOf('/', 0) === 0
        if (isCommand) {
            const command = text.split(' ')[0]
            const args = text.replace(command, '').trim()

            if (this.commands[command]) {
                this.commands[command](msg, args)
            } else if (this.onMissingAction) {
                this.onMissingAction(msg, args)
            } else {
                this.sendMessage(msg.chat.id,
                    `Command '${command}' not available.\nSee: /help`
                );
            }
        } else if (this.onPlainTextAction) {
            this.onPlainTextAction(msg)
        }
    }

    public onCommand(command: string, action: BotAction) {
        this.commands[command] = action
        console.log('Registered command:', command)
    }

    public help(msg: t.Message, arg?: string) {

    }
}
