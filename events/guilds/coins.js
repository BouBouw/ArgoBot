const db = require('quick.db');
const colors = require('colors');

module.exports = {
	name: 'ready',
	once: false,
	execute: async (client) => {
        setInterval(async () => {
            client.guilds.cache.forEach(async (guild) => {
                if(db.get(`client_${client.user.id}_coins`) == 'enable') {
                    console.log(`${guild.name} | Coins enable`.bold.green)
                   const normal = db.fetch(`client_${client.user.id}_coins_normal`) || 10;
                   const stream = db.fetch(`client_${client.user.id}_coins_stream`) || 5;
                   const mute = db.fetch(`client_${client.user.id}_coins_mute`) || 5;
    
                   setInterval(async () => {
                    const channels = guild.channels.cache.filter(c => c.type === 'GUILD_VOICES');
    
                    channels.forEach(async (c) => {
                        c.members.forEach(async (m) => {
                            if(m.bot) return;
    
                            if(m.voice.channel) {
                                if(db.fetch(`guild_${guild.id}_users_${m.user.id}_coins`) == null) { db.set(`guild_${guild.id}_users_${m.user.id}_coins`, normal) } else { db.add(`guild_${guild.id}_users_${m.user.id}_coins`, normal) }
                            }
    
                            if(m.voice.streaming) {
                                db.add(`guild_${guild.id}_users_${m.user.id}_coins`, stream)
                            }
    
                            if(m.voice.selfDeaf ||m.voice.selfMute) {
                                db.subtract(`guild_${guild.id}_users_${m.user.id}_coins`, mute)
                            }
                        })
                    })
                   }, 60000)
                }
            })
        }, 300000)
    }
}