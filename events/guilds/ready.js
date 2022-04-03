const db = require('quick.db');
const colors = require('colors');

module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
        setInterval(async () => {
            client.guilds.cache.forEach(async (guild) => {
                if(db.get(`client_${client.user.id}_coins`) == 'enable') {
                    console.log(`${guild.name} | Coins enable`.bold.green)
                    let array = db.get(`client_${client.user.id}_coinsSettings`)
                    if(!array) {
                        array = 1;
                    }
    
                   setInterval(async () => {
                    const channels = guild.channels.cache.filter(c => c.type === 'GUILD_VOICES');
    
                    channels.forEach(async (c) => {
                        c.members.forEach(async (m) => {
                            if(m.bot) return;
    
                            if(m.voice.channel) {
                                if(db.fetch(`guild_${guild.id}_users_${m.user.id}_coins`) == null) { db.set(`guild_${guild.id}_users_${m.user.id}_coins`, array[0]) } else { db.add(`guild_${guild.id}_users_${m.user.id}_coins`, array[0]) }
                                console.log(`Adding coins to ${m.user.tag}`)
                            }
    
                            if(m.voice.streaming) {
                                db.add(`guild_${guild.id}_users_${m.user.id}_coins`, array[1])
                            }
    
                            if(m.voice.selfDeaf ||m.voice.selfMute) {
                                db.subtract(`guild_${guild.id}_users_${m.user.id}_coins`, array[2])
                            }
                        })
                    })
                   }, 60000)
                }
            })
        }, 60000)
    }
}