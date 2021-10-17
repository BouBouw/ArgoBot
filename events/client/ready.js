const db = require('quick.db')

module.exports = {
	name: 'ready',
	once: false,
	execute: async (client) => {
        const arr = db.get(`global_settings_${client.user.id}`)
        console.log(`API > `.bold.white + `Connected has ${client.user.tag}`.bold.green)
        client.user.setActivity(`${arr[1]}help - 🌹 V@0.0.1`, { type: "WATCHING", url: "https://twitch.tv/twitch" })
        client.user.setStatus('idle')

        client.guilds.cache.forEach(async (guild) => {
            console.log(`${guild.name} (${guild.id})`.bold.yellow)
        })
    }
}