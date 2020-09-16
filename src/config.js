import * as fs from 'fs';

/**
 * @type {Config}
 */
let defaultConfig = null;

export default class Config {
    static configurationFile = 'config.txt';

    port = 9673;
    debug = false;
    
    modules = {
        telegram: {
            use: false,
            token: '',
            chatId: 0
        }
    };

    static load (file = Config.configurationFile) {
        let result;
        try {
            const data = fs.readFileSync(file);
            const obj = JSON.parse(data);
            result = Object.assign(new Config(), obj);
        } catch (e) {
            result = new Config();
        }

        defaultConfig = result;

        return result;
    }

    /**
     * @returns {Config}
     */
    static Get () {
        if (!defaultConfig)
            Config.load();
        return defaultConfig;
    }
}