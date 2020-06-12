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

let noDrops = !(process.argv.includes("--enable-drops") || process.argv.includes("-D"))

let first = false

const prefix = "i?"

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    if (!first) {
        if (!noDrops) {
            client.say(cfg.channel, "!drop me // initial InfiGhostBot drop, triggered by the first message.")
        } else {
            console.log("[infighostbot] Drops are disabled, --enable-drops or -D to enable")
        }
        first = true
    }

    if (!message.startsWith(prefix)) return

    const command = message.split(" ")[0].substr(prefix.length)
    const args = message.split(" ").slice(1)

    if (command === 'raid') {
        client.say(channel, `@${tags.username} => https://cdg.sh/raid`);
    } else if (command === "quote") {
        if (args.length < 3) return client.say(`!_ not enough arguments (${prefix}quote <who> <when> <what>)`)
        let append = ""
        if (tags.username !== cfg.owner) append += `(quoted by ${tags.username})`
        const quotable = `<blockquote>"${args.slice(2).join(" ")}"</blockquote><i>-${args[0]} ${args[1]} ${append}`
        client.say(channel, quotable)
    }
});

setInterval(() => {
    if (!noDrops) {
        client.say(cfg.channel, "!drop me").then(() => {
            console.log("[infighostbot] Sent `!drop me`")
        })
    }
}, 91 * 1000)
