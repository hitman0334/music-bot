const Discord = require('discord.js'),
    DisTube = require('distube'),
    client = new Discord.Client(),
    config = {
        prefix: process.env.PREFIX || "Custom Prefix",
        token: process.env.TOKEN || "Your Discord Token"
    };

const distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`This bot is made by Shahzain please do not take any credits of this bot`) 
    client.user.setActivity(`${config.prefix}help || Bot by Shahzain`, {
        type: "LISTENING"
    })
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command === "help") {
        let embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`${client.user.username} Commands`)
        .setThumbnail(client.user.displayAvatarURL())
        .addField('Play Command', `${config.prefix}play`)
        .addField('Loop Command', `${config.prefix}loop`)
        .addField('Stop Command', `${config.prefix}stop`)
        .addField('Skip Command', `${config.prefix}skip`)
        .addField('Queue Command', `${config.prefix}queue`)
        .addField('BassBoost Command', `${config.prefix}bassboost`)
        .setFooter(`© Shahzain `, client.user.displayAvatarURL())
        message.channel.send(embed)
    }

    if (command == "play" || command === "p")
    if (!args.join(" ")) return message.channel.send({embed: {color: "RED", description: 'Please provide the song name or link!'}})
        distube.play(message, args.join(" ")); // plays music from youtube

    if (command === "loop" || command === "repeat") {
        let mode = distube.setRepeatMode(message, parseInt(args[0]));
        mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";
        message.channel.send({embed: {color: "GREEN", description: "Set repeat mode to `" + mode + "`"}});
    }

    if (command == "stop") {
        distube.stop(message);
        message.channel.send({embed: {color: "GREEN", description:"Stopped the music!"}});
    }

    if (command == "skip")
        distube.skip(message);

    if (command == "queue") {
        let queue = distube.getQueue(message);
        if (!queue) return message.channel.send({embed: {color: "GREEN", description: "There is nothing playing"}})
        message.channel.send({embed: {color: "GREEN", description:'Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n")}});
    }
    if (command === "volume") {
        let volume = args[0]
        if (!volume) return message.channel.send({embed: {
            color: "GREEN",
            description: "Please give the number to set the volume to!"
        }})
        distube.setVolume(message, args[0]);
        message.channel.send({embed: {color: "GREEN", description: `Set volume to ${args[0]}`}})
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send({embed: {color: "GREEN", description:"Current queue filter: " + (filter || "Off")}});
    }
});

const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

distube
    .on("playSong", (message, queue, song) => message.channel.send({embed: {color: "GREEN", description:
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
}}))
    .on("addSong", (message, queue, song) => message.channel.send({embed: {color: "GREEN", description:
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
}}))
    .on("playList", (message, queue, playlist, song) => message.channel.send({embed: {color: "RED", description:
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
}}))
    .on("addList", (message, queue, playlist) => message.channel.send({embed: {color: "GREEN", description:
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    }}))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send({embed: {color: "GREEN", description:`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`}});
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send({embed: {color: "RED", description:`Searching canceled`}}))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send({embed: {color: "RED", description:"An error encountered: " + e}});
    });

client.login(config.token);