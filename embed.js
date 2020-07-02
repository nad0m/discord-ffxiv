const getEmbed = fields => {
  if (fields.length === 0) {
    fields.push({
      name: 'No progress made...',
      value: ':('
    })
  }

  const embed = {
    color: 0x0099ff,
    title: '24-Hour Progress Report',
    thumbnail: {
      url: 'https://img2.finalfantasyxiv.com/c/S05_bf25a86aaf6f6329f19606513073ddb2_07_64x64.png',
    },
    timestamp: new Date(),
    footer: {
      text: 'Reach out to Doctor Doctor for more info about this bot',
      icon_url: 'https://avatars2.githubusercontent.com/u/20848851?s=60&v=4',
    },
    fields
  }
  
  return embed
}

module.exports = {
  getEmbed
}