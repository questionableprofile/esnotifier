import Express from 'express';

import EventHandler from './eventHandler.js';
import Config from './config.js';
import TelegramModule from './modules/telegram.js';
import Commands from "./commands/Commands.js";

const config = Config.load();
const commands = new Commands();
const telegram = new TelegramModule(commands);

const app = Express();
const esoCommands = [];

app.use(Express.json());
app.use((request, response, next) => {
    response.append('Access-Control-Allow-Origin', ['*']);
    response.append('Access-Control-Allow-Headers', ['*']);
    next();
})

app.post('/event', (req, res) => {
    const body = req.body;
    if (body && body.code) {
        if (config.debug) {
            console.log(`code: ${body.code} raw data:`);
            console.log(body.data);
            console.log(req.headers);
            // console.log(req);
        }
        if (body.data) {
            EventHandler.handle(body.code, body.data);
        }
        else
            EventHandler.handle(body.code);
        
        res.status(200);
        res.end();
    }

    res.status(400);
    res.end();
});

app.get('/commands', (req, res) => {
    const list = [];
    while (esoCommands.length > 0)
        list.push(esoCommands.pop());
    const result = {
        commands: list
    };
    res.status(200);
    res.send(result);
    res.end();
});

app.listen(config.port, () => console.log(`server started on port ${config.port}`));

export function pushCommand (esoCommand) {
    esoCommands.push(esoCommand);
}