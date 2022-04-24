import {pushCommand} from "../app.js";

export class EsoController {
    static reconnect () {
        const cmd = new EsoCommand('reconnect')
        pushCommand(cmd);
    }

    static sendMessage (text) {
        const data = {
            text: text
        };
        const cmd = new EsoCommand('sendMessage', data);
        pushCommand(cmd);
    }
}

export class EsoCommand {
    type;
    data;

    constructor(type, data = null) {
        this.type = type;
        if (data)
            this.data = data;
    }
}