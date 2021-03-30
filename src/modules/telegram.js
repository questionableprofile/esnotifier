import Bot from 'node-telegram-bot-api';

import Config from '../config.js';
import EventHandler from '../eventHandler.js';
import pkg from '../../node_modules/html-entities/lib/index.js';

/**
 * @type {Config}
 */
const {decode} = pkg;
const config = Config.Get();
const mconfig = config.modules.telegram;

export default class TelegramModule {
    /**
     * @type {Bot}
     */
    bot;

    constructor () {
        /**
         * @todo bot loading seems asynchronous. needs to be handled properly.
         */
        this.bot = new Bot(mconfig.token, { polling: true });

        EventHandler.subscribe((code, data) => this.handleEvent(code, data));
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
                if (eventData.track.type == '2ch')
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
        this.bot.sendMessage(mconfig.chatId, decode(result));
    }

    static init () {
        if (mconfig.use)
            return new TelegramModule();
    }
}
