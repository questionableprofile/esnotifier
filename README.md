# esnotifier

## Using the Notifier

### Configuration

Rename `sampleconfig.txt` to `config.txt`

#### Using with [Telegram](https://telegram.org/)
- Create a bot using the `@BotFather`
- Get the bot token
- Get your personal chat_id (with `@myidbot` for example)

Edit the following part of the `config.txt`
```JSON
"telegram": {
  "use": true,
  "token": "YOUR TOKEN",
  "chatId": 123
}
```
- Bot's token - `"token"` field
- Chat_id - `"chatId"` field
- To enable Telegram module leave field `"use"` - `true`

### Client

Client is integrated into eso, use `/notf` command to enable it

### Running 

```
$ npm install
```

and then
```bash
$ npm start
```
or click `eso.bat` on Windows

## Development

App server is listening on `http://localhost:9673` by default

To create an event, make POST request to `/event` URL with a JSON data payload

Example JSON scheme:
```JSON
{
    "code": "EVENT_CODE",
    "data": {
        "gameData": {
          "node": "ext_square"
        },
        "eventData": {
          "reason": "EVENT_CODE",
          "sender": 1,
          "message": "Hello, World!"
        },
        "actor": {
          "id": 1,
          "name": "UserName"
        }
    }
}
```
