import Command from "./Command.js";
import {EsoController} from "./EsoApi.js";

export default class ReconnectCommand extends Command {
    getName() {
        return "reconnect";
    }

    process(ctx) {
        EsoController.reconnect();
        this.answer('Reconnecting', ctx);
    }
}