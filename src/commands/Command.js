export default class Command {
    getName () {}

    process(ctx) {}

    answer (text, context) {
        if (context.access(this, context))
            context.asyncSender(text);
    }
}