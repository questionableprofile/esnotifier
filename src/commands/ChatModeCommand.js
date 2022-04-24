import Command from "./Command.js";

export default class ChatModeCommand extends Command {
    getName() {
        return 'chat';
    }

    process(ctx) {
        if (!ctx.frameworkContext.chatMode) {
            ctx.frameworkContext.chatMode = true;
            this.answer('Chat mode enabled', ctx);
        }
        else {
            ctx.frameworkContext.chatMode = false;
            this.answer('Chat mode disabled', ctx);
        }
    }
}