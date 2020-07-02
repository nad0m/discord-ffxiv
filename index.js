require("dotenv").config()
const { getStatus } = require('./api')
const Discord = require("discord.js")
const client = new Discord.Client()
const { getEmbed } = require('./embed')
const { runSchedule } = require('./util')

let channelId = '712206529981579355'
const prefix = '!thorn'

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity("with Doctor Doctor", {
    type: "PLAYING"
  });

  const onSchedule = () => {
    const channel = client.channels.cache.get(channelId)
    onDataFinish = result => {
      channel.send({ embed: getEmbed(result) })
    }
    getStatus(onDataFinish, true)
  }
  runSchedule(onSchedule)
})

client.on("message", msg => {
  const channel = client.channels.cache.get(msg.channel.id)
  const memberJoin = msg.type === "GUILD_MEMBER_JOIN";

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).split(' ');
  const command = args[1]

  if (command === "set-channel") {
    if (!args[2]) {
      channel.send('Please provide a channel ID.')
      return
    }

    channelId = args[2]
    channel.send('Channel set. I will post automatic progress reports only to that channel.')
  }

  if (msg.content === "!thorn progress") {
    const cb = result => {
      channel.send({ embed: getEmbed(result) })
    }
    getStatus(cb)
  }

  if (msg.content.startsWith('!thorn setChannel')) {

  }

  if (memberJoin) {
    channel.send(`Hi, <@${msg.member.id}>! Welcome to Crystal Thorn.`)
  }
})