const path = require("path");
const { readFileSync, writeFileSync } = require("fs");

module.exports = {
    name: "delchan",
    aliases: [],
    description: "Remove a Twitch channel to the Watch list.",
    category: "Streaming",
    usage: "<TwitchChannelName>",
    ownerOnly: false,
    async execute(bot, message, args, settings) {
        //Declarations
        const channels = JSON.parse(readFileSync(path.join(__dirname, "./channels.json"), "utf8"));
        const delChan = args.join(" ").toLowerCase();
        let setChans = [];

        //Checks
        if (!delChan) message.reply(`\nPlease provide a channel name to remove.`).then(s => s.delete({ timeout: 30 * 1000 }));

        //Setup "Database"
        if (!channels[message.guild.id]) { channels[message.guild.id] = {}; }
        Object.values(channels[message.guild.id]).forEach(element => { setChans.push(element.ChannelName); });

        if (!setChans.some(ch => ch === delChan)) return message.reply(`\nThis channel was not found in my database.`).then(s => s.delete({ timeout: 30 * 1000 }));

        delete channels[message.guild.id][delChan]

        //Write to Database
        writeFileSync(path.join(__dirname, "./channels.json"), JSON.stringify(channels, null, 2), function (err) {
            if (err) return message.reply(`\nAn error occured, Did not save channel.`).then(s => s.delete({ timeout: 30 * 1000 }));
        });
        message.reply(`\nDeleted ${delChan} from the database.`).then(s => s.delete({ timeout: 30 * 1000 }));
    }
}