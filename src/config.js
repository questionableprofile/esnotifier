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
            chatId: 0,
            receiveDisconnects: true
        }
    };

    static load (file = Config.configurationFile) {
        let result;
        try {
            const data = fs.readFileSync(file);
            const obj = JSON.parse(data);
            result = Object.assign(new Config(), obj);
        } catch (e) {
            console.error('Missing or incorrect configuration file');
            console.error(e);
            // fs.writeFileSync(Config.configurationFile, JSON.stringify(new Config));
            return;
        }

        defaultConfig = result;

        return result;
    }

    static write (file = Config.configurationFile) {
        fs.writeFileSync(file, JSON.stringify(Config.getConfig(), null, '\t'));
    }

    /**
     * @returns {Config}
     */
    static getConfig () {
        if (!defaultConfig)
            Config.load();
        return defaultConfig;
    }
}