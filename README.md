# Telegram-Typed Bot

## Getting Started

This project uses [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) module and a custom typing. Make sure you have installed [Node and npm](https://nodejs.org/).

### Fork this repository

Just fork it.

### Token

Ask for an Token to **Telegram's official bot: [@BotFather](https://telegram.me/botfather).**

Detailed info here: https://core.telegram.org/bots#3-how-do-i-create-a-bot

### [Openshift](https://openshift.redhat.com) deployment for a new bot

Create an account (if you don't have one) and download their **[rhc](https://developers.openshift.com/en/managing-client-tools.html) gem**. Make sure you have **Ruby** installed.

```sh
# Gem install
$ gem install rhc

# Setup with your account and public key,
$ rhc setup
```

Once you are ready, create a Node app:

```sh
# This will crate an app on https://APP_NAME-NAMESPACE.rhcloud.com
# Also will clone your new app repository on the current directory.
$ rhc app create APP_NAME nodejs-0.10 \
    -e TELEGRAM_TOKEN=TELEGRAM_TOKEN \
    -n NAMESPACE \
    --from-code=FORKED_REPO
```

* `APPNAME`: Name for your app.
* `NAMESPACE`: You are forced to have a namespace in OpenShift
* `TELEGRAM_TOKEN`: Your token from [@BotFather](https://telegram.me/botfather).
* `FORKED_REPO`: Your forked version of this repo.
  * Example: http://github.com/USER_NAME/FORKED_REPO.git


**Now you can start talking with your bot :smiley:**


### Add Openshift repository as remote

Check your repository url on Openshift. You can do this by typing:

```sh
$ rhc app show APP_NAME
```

Get the `Git_URL` and set it as remote, let's name it `openshift`.
```sh
$ git remote add openshift Git_URL
```

So now, to deploy an updated version of your app:
```sh
$ git push openshift master
```


# Project Setup

This project uses [gulp](http://gulpjs.com/) as its build system.

- Install gulp: `$ npm install -g gulp`
- Install dependencies: `$ npm install`

## Local development

To develop your bot locally, you need a **secure** connection to your local host. One way to achieve this is using a [ngrok](https://ngrok.com/) to create a *tunnel* to your computer.

#### Example

Once installed, create a tunnel to your app.
```sh
$ ngrok 8080

# Tunnel Status                 online
# Version                       1.7/1.7
# Forwarding                    http://SUBDOMAIN.ngrok.com -> 127.0.0.1:8080
# Forwarding                    https://SUBDOMAIN.ngrok.com -> 127.0.0.1:8080
# Web Interface                 127.0.0.1:4040
# # Conn                        0
# Avg Conn Time                 0.00ms
```

Then we set our development *environment variables*.
```sh
$ export TELEGRAM_TOKEN="TOKEN"
$ export PORT="8080"
$ export LOCAL_IP="127.0.0.1"
$ export LOCAL_URL="SUBDOMAIN.ngrok.com"
```

Build and run
```sh
$ npm start
```

## Testing

This project usings [mocha](http://visionmedia.github.io/mocha/) for unit testing.

Install mocha:
```sh
$ npm install -g mocha
```

To compile and test run:
```sh
$ npm test

```


# License

MIT
