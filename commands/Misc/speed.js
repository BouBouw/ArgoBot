const db = require('quick.db');

module.exports = {
    name: "speed",
    aliases: ['latence'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    let ping = Date.now() - message.createdTimestamp;

    if(arr[0] === 'FR_fr') {
        return message.channel.send({
            content: `Latence: **${ping}ms**\nAPI: **${Math.round(client.ws.ping)}ms**`
        })
    } else {
        return message.channel.send({
            content: `Latency: **${ping}ms**\nAPI: **${Math.round(client.ws.ping)}ms**`
        })
    }
    }
}