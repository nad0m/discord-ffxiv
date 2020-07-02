require("dotenv").config()
const { getStatus } = require('./api')
const Discord = require("discord.js")
const client = new Discord.Client()
const { getEmbed } = require('./embed')
const { runSchedule } = require('./util')

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity("with Doctor Doctor", {
    type: "PLAYING"
  });

  const onSchedule = () => {
    const channel = client.channels.cache.get('712206529981579355')
    onDataFinish = result => {
      channel.send({ embed: getEmbed(result) })
    }
    getStatus(onDataFinish)
  }
  runSchedule(onSchedule)
})

client.on("message", msg => {
  const channel = client.channels.cache.get(msg.channel.id)
  const memberJoin = msg.type === "GUILD_MEMBER_JOIN";

  if (msg.content === "!thorn status") {
    const cb = result => {
      channel.send({ embed: getEmbed(result) })
    }
    getStatus(cb)
  }

  if (memberJoin) {
    channel.send(`Hi, <@${msg.member.id}>! Welcome to Crystal Thorn.`)
  }
})
