require("dotenv").config()
const { getStatus } = require('./api')
const Discord = require("discord.js")
const client = new Discord.Client()
const { getEmbed } = require('./embed')

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity("with Doctor Doctor", {
    type: "PLAYING"
  });
})

client.on("message", msg => {
  const channel = client.channels.cache.get(msg.channel.id)
  
  if (msg.content === "!thorn status") {
    const cb = result => {
      channel.send({ embed: getEmbed(result) })
    }
    getStatus(cb)
  }
})


/**
 const exampleEmbed = {
    color: 0x0099ff,
    title: 'Progress Report',
    thumbnail: {
      url: 'https://img2.finalfantasyxiv.com/c/S05_bf25a86aaf6f6329f19606513073ddb2_07_64x64.png',
    },
    fields: [
      {
        name: '-----------------------',
        value: '[Doctor Doctor]',
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: '-----------------------',
        value: '[Doctor Doctor]',
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: 'Dragoon',
        value: '34 (+2)',
        inline: true,
      },
      {
        name: '-----------------------',
        value: '\u200b',
      }
    ],
    timestamp: new Date(),
    footer: {
      text: 'Reach out to Doctor Doctor for more info about this bot',
      icon_url: 'https://i.imgur.com/wSTFkRM.png',
    },
  };
 */
