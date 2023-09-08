import Bot from 'node-telegram-bot-api';

import Config from '../config.js';
import EventHandler from '../eventHandler.js';
import pkg from '../../node_modules/html-entities/lib/index.js';
import {CommandContext} from "../commands/commandUtil.js";
import {EsoController} from "../commands/EsoApi.js";

/**
 * @type {Config}
 */
const {decode} = pkg;

export default class TelegramModule {
    /**
     * @type {TelegramBot}
     */
    bot;
    commands;
    chatMode = true;
    skipCommands = ['/play', '/skip', '/ll', '/node', '/try', '/roll', '/dice', '/mm', '/autoreconnect'];

    constructor (commands) {
        /**
         * @todo bot loading seems asynchronous. needs to be handled properly.
         */
        this.mconfig = Config.getConfig().modules.telegram;

        if (!this.mconfig.use)
            return;

        this.commands = commands;
        this.bot = new Bot(this.mconfig.token, { polling: true });
        EventHandler.subscribe((code, data) => this.handleEvent(code, data));
        this.bot.on('message', (msg) => this.onMessage(msg));
    }

    shouldSkipCommand (text) {
        for (let cmd of this.skipCommands) {
            if (text.startsWith(cmd)) {
                return true;
            }
        }
        return false;
    }

    onMessage (msg) {
        const id = msg.chat.id;
        if (id != this.mconfig.chatId) {
            console.log(msg.chat);
            return;
        }
        const text = msg.text || '';
        const originCtx = new CommandContext('telegram', text, msg, this,
            (text) => this.sendMessage(text),
            (cmd, ctx) => this.access(cmd, ctx),
            (ctx) => this.setOwner(ctx)
        );
        if (msg.entities && msg.entities.reduce((prev, cur) => prev || cur.type === 'bot_command', false) && !this.shouldSkipCommand(msg.text)) {
            this.commands.execute(text.slice(1), originCtx);
        }
        else if (msg.text && this.chatMode) {
            EsoController.sendMessage(msg.text);
        }
    }

    sendMessage (text) {
        this.bot.sendMessage(this.mconfig.chatId, text);
    }

    access (command, commandContext) {
        if (!this.mconfig.chatId && command.getName() === 'start')
            return true;
        return this.mconfig.chatId === commandContext.context.chat.id;
    }

    setOwner (ctx) {
        const id = ctx.context.chat.id;
        if (this.mconfig.chatId)
            return false;

        this.mconfig.chatId = id;
        // console.log(config);
        Config.write();
        return true;
    }

    handleEvent (code, data) {
        const gameData = data.gameData;
        const eventData = data.eventData;
        const actor = data.actor;
        let date = new Date();
        let hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
        let min = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
        let result = gameData && gameData.node ? `[${gameData.node}] ` : '';

        switch(code) {
            case 'chat':
                result += `[${actor.id}] ${actor.name}:  ${eventData.message}`;
                break;
            case 'serverBroadcast':
                result += `Блютекст: ${eventData.message}`;
                break;
            case 'tryMessage':
                result += `[${actor.id}] [try] ${actor.name}: ${eventData.success ? 'успешно': 'безуспешно'} ${eventData.message}`;
                break;
            case 'userRoll':
                result += `[${actor.id}] [roll] ${actor.name} rolled ${eventData.num}`;
                break;
            case 'diceResult':
                let diceString = '';
                eventData.rolls.forEach(dice => {
                    diceString = diceString.concat(`${dice.num}/${dice.sides} `);
                })
                result += `[${actor.id}] [dice] ${actor.name} rolled ${diceString}`;
                break;
            case 'youtubePlaying':
                let videoLink = '';
                if (eventData.track.type === '2ch' || eventData.track.type === 'other')
                    videoLink = eventData.track.id;
                else
                    videoLink = `https://www.youtube.com/watch?v=${eventData.track.id}`;
                result += `[${actor.id}] [yt-play] ${actor.name} played ${videoLink}`;
                break;
            case 'esoDisconnected':
                result += `DISCONNECT`;
                break;
            default:
                console.warn(`unknown event code: ${code}`);
                result += `[no data] [${code}]`;
        }
        console.log(`[${hour}:${min}] received event '${code}'`);
        this.bot.sendMessage(this.mconfig.chatId, decode(result));
    }
}
