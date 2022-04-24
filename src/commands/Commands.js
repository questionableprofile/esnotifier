import ReconnectCommand from "./ReconnectCommand.js";
import StartCommand from "./StartCommand.js";
import ChatModeCommand from "./ChatModeCommand.js";

export default class Commands {
    map = {};

    constructor () {
        const list = [
            new ReconnectCommand(),
            new StartCommand(),
            new ChatModeCommand()
        ];
        list.forEach(cmd => this.map[cmd.getName()] = cmd);
    }

    execute (name, ctx) {
        let command;
        if ((command = this.map[name]))
            command.process(ctx);
    }
}