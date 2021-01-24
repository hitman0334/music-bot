const Discord = require('discord.js')
const client = new Discord.Client()

const prefix = "!"

const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;


client.on('ready', () => {
    console.log(`${client.user.username} is now online!`)
})

client.on('message', async message => { 
    client.player.on('trackStart', (message, track) => message.channel.send({embed: {color: "GREEN", description: `Now playing ${track.title}...`}}))
    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "play" || command === "p") {
        client.player.play(message, args[0]);
    }
})

client.login(process.env.token)