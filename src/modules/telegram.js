import Bot from 'node-telegram-bot-api';

import Config from '../config.js';
import EventHandler from '../eventHandler.js';

/**
 * @type {Config}
 */
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

        let result = gameData && gameData.node ? `[${gameData.node}]` : '';

        switch(code) {
            case 'chat':
                result += ` ${actor.id}:${actor.name}: ${eventData.message}`;
                break;
            default:
                console.warn(`unknown event code: ${code}`);
                result += '[no data]';
        }

        this.bot.sendMessage(mconfig.chatId, `${code}`);
        this.bot.sendMessage(mconfig.chatId, result);
    }

    static init () {
        if (mconfig.use)
            return new TelegramModule();
    }
}