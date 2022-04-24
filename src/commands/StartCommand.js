import Command from "./Command.js";

export default class StartCommand extends Command {

    getName() {
        return 'start';
    }

    process(ctx) {
        const result = ctx.setOwner(ctx);
        if (result)
            this.answer('Done! You are set owner', ctx);
        else
            console.error('owner already set');
    }
}