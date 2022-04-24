export class CommandContext {
    type;
    text;
    context;
    frameworkContext;

    asyncSender;
    access;
    setOwner;

    constructor(type, text, context, frameworkCtx, asyncSender, access, setOwner) {
        this.type = type;
        this.text = text;
        this.context = context;
        this.frameworkContext = frameworkCtx;
        this.asyncSender = asyncSender;
        this.access = access;
        this.setOwner = setOwner;
    }
}