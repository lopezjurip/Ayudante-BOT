/// <reference path="../es6-promise/es6-promise.d.ts"/>
/// <reference path="../node/node.d.ts"/>

declare module "node-telegram-bot-api-interfaces" {
  export interface IPollingOptions {
    timeout?: number | string
    interval?: number | string
  }

  export interface IWebHookOptions {
    host: string
    port: number
    key?: string
    cert?: string
  }

  export interface ITelegramBotOptions {
    webHook?: boolean | IWebHookOptions
    polling?: boolean | IPollingOptions
  }

  export interface Update {
    update_id: number
    message?: Message
  }

  export interface User {
    id: number
    first_name: string
    last_name?: string
    username?: string
  }

  export interface GroupChat {
    id: number
    title: number
  }


  export interface IFile {
    file_id: string
    file_size?: number
  }

  export interface IMimeType extends IFile {
    mime_type?: string
  }

  export interface IMedia extends IFile {
    width: number
    height: number
  }

  export interface IThumbMedia extends IMedia {
    thumb?: PhotoSize
  }


  export interface PhotoSize extends IMedia {

  }

  export interface Audio extends IMimeType {
    duration: number
  }

  export interface Document extends IMimeType, IThumbMedia {
    file_name?: string
  }

  export interface Sticker extends IThumbMedia {

  }

  export interface Video extends IThumbMedia, IMimeType {
    duration: number
  }

  export interface Contact {
    phone_number: string
    first_name: string
    last_name?: string
    user_id?: number
  }

  export interface Location {
    longitude: number
    latitude: number
  }

  export interface UserProfilePhotos {
    total_count: number
    photos: PhotoSize[][]
  }

  export interface Message {
    message_id: number
    from: User
    date: number
    chat: User | GroupChat
    forward_from?:	User
    forward_date?: number
    reply_to_message?: Message
    text?: string
    audio?: Audio
    document?:	Document
    photo?: PhotoSize[]
    sticker?: Sticker
    video?: Video
    caption?: string
    contact?: Contact
    location?: Location
    new_chat_participant?: User
    left_chat_participant?: User
    new_chat_title?: string
    new_chat_photo?: PhotoSize[]
    delete_chat_photo?: boolean
    group_chat_created?: boolean
  }

  export interface IKeyboard {
    selective?: boolean
  }

  export interface IReplyKeyboardMarkup extends IKeyboard {
    keyboard: string[][]
    resize_keyboard?: boolean
    one_time_keyboard?: boolean
  }

  export interface IReplyKeyboardHide extends IKeyboard {
    hide_keyboard: boolean
  }

  export interface IForceReply extends IKeyboard {
    force_reply: boolean
  }

  export interface IReplyOptions {
    reply_to_message_id: number
    reply_markup: IReplyKeyboardMarkup | IReplyKeyboardHide | IForceReply
  }

  export interface ISendMessageOptions extends IReplyOptions {
    disable_web_page_preview: boolean
  }

  export interface ISendPhotoOptions extends IReplyOptions {
    caption: string
  }

  export interface ISendAudioOptions extends IReplyOptions {
    duration: number
  }

  export interface ISendVideoOptions extends IReplyOptions {
    caption: string
    duration: number
  }
}

declare module "node-telegram-bot-api" {
  import stream = require("stream");
  import {
    User,
    Update,
    Message,
    UserProfilePhotos,
    ITelegramBotOptions,
    ISendMessageOptions,
    ISendPhotoOptions,
    ISendAudioOptions,
    IReplyOptions,
    ISendVideoOptions,
  } from "node-telegram-bot-api-interfaces";

  class TelegramBot {
    constructor(token: string, options: ITelegramBotOptions)

    setWebHook(url?: string)
    getUpdates(timeout?: number | string, limit?: number | string, offset?: number | string) : Promise<Update>

    on(event: string, action: (msg: Message) => any)
    getMe() : Promise<User>

    sendMessage(chatId: number | string, text: string, options?: ISendMessageOptions) : Promise<Message>
    sendPhoto(chatId: number | string, photo: string | stream.Stream, options?: ISendPhotoOptions) : Promise<Message>
    sendAudio(chatId: number | string, audio: string | stream.Stream, options?: ISendAudioOptions) : Promise<Message>
    sendDocument(chatId: number | string, path: string | stream.Stream, options?: IReplyOptions) : Promise<Message>
    sendSticker(chatId: number | string, path: string | stream.Stream, options?: IReplyOptions) : Promise<Message>
    sendVideo(chatId: number | string, path: string | stream.Stream, options?: ISendVideoOptions) : Promise<Message>
    sendLocation(chatId: number | string, latitude: number, longitude: number, options?: IReplyOptions) : Promise<Message>

    forwardMessage(chatId: number | string, fromChatId: number | string, messageId: number | string) : Promise<Message>

    sendChatAction(chatId: number | string, action: string)

    getUserProfilePhotos(userId: number | string, offset?: number, limit?: number) : Promise<UserProfilePhotos>
  }

  export = TelegramBot;
}
