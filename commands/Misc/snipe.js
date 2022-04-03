const db = require('quick.db');

module.exports = {
    name: "snipe",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const sniper = db.get(`snipe_${client.user.id}`)
    return message.channel.send({
        embeds: [{
            color: `#326e2f`,
            author: {
                name: `${client.users.cache.get(sniper[0]).tag}`,
                icon_url: `${client.users.cache.get(sniper[0]).avatarURL()}`,
            },
            description: `> ${sniper[1]}`
        }]
    })
    }
}