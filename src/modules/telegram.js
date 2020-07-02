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
        console.log(code, data);
        this.bot.sendMessage(mconfig.chatId, `${code}`);

        // let result;
        // switch(code) {
            // case 'chat':
                // result = `${data.id}: ${data.}`
        // }
    }

    static init () {
        if (mconfig.use)
            return new TelegramModule();
    }
}