const {Client, Events, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { token } = require('./config.json');
const { Member } = require('eris');
const { request } = require('undici');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});


client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    client.on("guildMemberAdd", async member => {
        const nameMember = member.displayName;
        const displayAvatarURL = member.user.displayAvatarURL({format:"jpg"});

        const channel = member.guild.channels.cache.find(ch => ch.name === 'boas-vindas');

        const screen = Canvas.createCanvas(700,250);
        const context = screen.getContext("2d");


        const background = await Canvas.loadImage("./background.png");
        
        context.drawImage(background, 0,0, screen.width, screen.height);
        
        //border
        context.strokeStyle = "#141414";
        context.strokeRect(0,0,screen.width, screen.height);

        context.font = "bold 20px Arial";
        context.fillStyle = "#ffffff";
        context.fillText(`Seja bem-vindo(a) ${nameMember} :)`, screen.width / 2.0, screen.height / 1.8);

        const avatar = await Canvas.loadImage(displayAvatarURL);

        context.drawImage(avatar, 25, 25,200, 200);

        const attachment = new AttachmentBuilder(await screen.encode("png"), {name:"profile-image.png"});

        channel.send({ files: [attachment] })
    })
});
client.login(token);