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
        .addField('Play Command', `${config.prefix}play <song url> - <name>`)
        .addField('Loop Command', `${config.prefix}loop`)
        .addField('Stop Command', `${config.prefix}stop`)
        .addField('Skip Command', `${config.prefix}skip`)
        .addField('Queue Command', `${config.prefix}queue`)
        .addField('Volume Command', `${config.prefix}volume <number>`)
        .addField('Pause Command', `${config.prefix}pause`)
        .addField('Resume Command', `${config.prefix}resume`)
        .addField('Join Command', `${config.prefix}join`)
        .addField('BassBoost Command', `${config.prefix}bassboost`)
        .addField('Echo Comamnd', `${config.prefix}echo`)
        .addField('3d Comamnd', `${config.prefix}3d`)
        .addField('Karaoke Comamnd', `${config.prefix}karaoke`)
        .addField('Nightcore Command', `${config.prefix}nightcore`)
        .addField('Vaporwave Command', `${config.prefix}vaporwave`)
        .setFooter(`© Shahzain `, client.user.displayAvatarURL())
        message.channel.send(embed) 
    }

    if (command == "play" || command === "p") {
        try {
        if (!message.member.voice.channel) return message.channel.send({embed: {color: "RED", description: "Please join a voice channel!"}})
            if (message.guild.me.voice.channel) {
                if (message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
                try {
                message.guild.me.voice.setDeaf(true, "Privacy reasons")
                if (!args.join(" ")) return message.channel.send({embed: {color: "RED", description: 'Please provide the song name or link!'}})
                    distube.play(message, args.join(" ")); // plays music from youtube
                } catch(err) {
                    message.channel.send({embed: "RED", description: `An error occured: ${err}`})
                }
            }
        message.guild.me.voice.setDeaf(true, "Privacy reasons")
    if (!args.join(" ")) return message.channel.send({embed: {color: "RED", description: 'Please provide the song name or link!'}})
        distube.play(message, args.join(" ")); // plays music from youtube
    } catch(err) {
        message.channel.send({embed: "RED", description: `An error occured: ${err}`})
    }
}

    if (command === "loop" || command === "repeat") {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}}) // Checks if music is playing or not
        try {
            
        let mode = distube.setRepeatMode(message, parseInt(args[0]));
        mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";
        message.channel.send({embed: {color: "GREEN", description: "Set repeat mode to `" + mode + "`"}});
        } catch(err) {
            message.channel.send({embed: {color: "RED", description: "There was an error"}})
        }
    }

    if (command == "stop") {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}})
        try {
            if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
        distube.stop(message);
        message.channel.send({embed: {color: "GREEN", description:"Stopped the music!"}});
        } catch(err) {
            message.channel.send({embed: {color: "RED", description: "There was an error"}})
        }
    }

    if (command == "skip") {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}})
        try {
            if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
        distube.skip(message)
    } catch(err) {
        message.channel.send({embed: {color: "RED", description: "There was an error"}})
    }
}
    if (command == "autoplay") {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}})
        try {
            if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
        let mode = distube.toggleAutoplay(message);
        message.channel.send({embed: {color: "GREEN", description: "Set autoplay mode to `" + (mode ? "On" : "Off") + "`"}});
    } catch(err) {
        message.channel.send({embed: {color: "RED", description: "There was an error"}})
    }
    }
    if (command == "queue") {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}})
        if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
        let queue = distube.getQueue(message);
        if (!queue) return message.channel.send({embed: {color: "GREEN", description: "There is nothing playing"}})
        message.channel.send({embed: {color: "GREEN", description:'Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n")}});
    }
    if (command === "volume") {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}})
        try {
            if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
        let volume = Number(args[0], 10)
        if (!volume) {
            const status = (queue) => `Volume: ${queue.volume}%`;
            message.channel.send({embed: {color: "GREEN", description: `${status}`}})
            return;
        }
        if (isNaN(volume)) return message.channel.send({embed: {color: "RED", description: "The given number is invalid!"}})
        if (volume < 0 || volume > 200) return message.channel.send({embed: {color: "RED", description: "The number should be between 0 and 200"}})
        distube.setVolume(message, volume);
        message.channel.send({embed: {color: "GREEN", description: `Set volume to ${volume}%`}})
    } catch(err) {
        message.channel.send({embed: {color: "RED", description: "There was an error"}})
    }
    }
    if (command === "pause") {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}}) 
        try {
            if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
        if (distube.isPaused(message)) return message.channel.send({embed: {color: "RED", description: "Queue is already paused"}}) // checks if the queue is paused
        distube.pause(message)
        message.channel.send({embed: {color: "GREEN", description: "Paused the queue"}});
    } catch(err) {
        message.channel.send({embed: {color: "RED", description: "There was an error"}})
    }
    }
    if (command === "resume") {
        try {
        if (!distube.isPaused(message)) return message.channel.send({embed: {color: "RED", description: "Queue is not paused"}}) // checks if the queue is paused
        distube.resume(message)
        message.channel.send({embed: {color: "GREEN", description: "Resumed the queue"}});
    } catch(err) {
        message.channel.send({embed: {color: "RED", description: "An error occured"}})
    }
    }
    if (command === "join") {
        if (!message.member.voice.channel) return message.channel.send({embed: {color: "RED", description: "Please join a voice channel!"}})
        message.member.voice.channel.join()
        message.guild.me.voice.setDeaf(true, "Privacy reasons")
        message.channel.send({embed: {color: "GREEN", description: "Joined your voice channel"}})
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        if (!distube.isPlaying(message)) return message.channel.send({embed: {color: "RED", description: "Nothing is playing"}})
        try {
            if (!message.member.voice.channel == message.guild.me.voice.channel) return message.channel.send({embed: {color: "RED", description: `You must be in the same voice channel as ${client.user}`}})
        let filter = distube.setFilter(message, command);
        message.channel.send({embed: {color: "GREEN", description:"Current queue filter: " + (filter || "Off")}});
    } catch(err) {
        message.channel.send({embed: {color: "RED", description: "An error occured"}})
    }
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
// if DisTubeOptions.searchSongs = true
.on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send({embed: {color: "GREEN", description:`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`}});
})
// if DisTubeOptions.searchSongs = true
.on("searchCancel", (message) => message.channel.send({embed: {color: "RED", description:`Searching canceled`}}))
.on("error", (message, e) => {
    console.error(e)
    message.channel.send({embed: {color: "RED", description:"An error encountered: " + e}})
.on('finish', async (message) => {
    message.channel.send({embed: {color: "GREEN", description: "Music Queue ended"}})
})
});

client.login(config.token);
