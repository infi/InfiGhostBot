const tmi = require('tmi.js');

const cfg = require("./config")

const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: cfg.username,
        password: cfg.password
    },
    channels: [cfg.channel]
});

client.connect();

let first = false

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    if (!first) {
        client.say(cfg.channel, "!drop me // initial InfiDropBot drop, triggered by the first message.")
        first = true
    }
    if (message.toLowerCase() === '!i?hello') {
        client.say(channel, `@${tags.username}, hello!`);
    }
});

setInterval(() => {
    client.say(cfg.channel, "!drop me").then(() => {
        console.log("[infidropbot] Sent `!drop me`")
    })
}, 91 * 1000)
