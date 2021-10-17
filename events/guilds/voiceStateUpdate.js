const db = require('quick.db');

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    execute: async (oldState, newState, client) => {
        const array = db.get(`client_${client.user.id}_voices`)

        if(!array) {
            return;
        } else {
            if(!newState.channel) {
                const voicesList = db.get(`client_${client.user.id}_voiceList`)
                if(!voicesList) {
                    return;
                } else {
                    if(voicesList.includes(oldState.channel.id)) {
                        const filtered = voicesList.filter(id => id !==oldState.channel.id);
                        db.set(`client_${client.user.id}_voiceList`, filtered)
                        if(oldState.channel.members.size <= 0) await oldState.channel.delete()
                    }
                }
            }

            if(!newState.channel) return;
            if(newState.channel.id === array[1]) {
                const channel = newState.guild.channels.cache.get(array[1])

                await newState.guild.channels.create(`${array[2]} - ${newState.member.user.username}`, {
                    type: 'GUILD_VOICE',
                    parent: channel.parent.id,
                    permissionOverwrites: [
                        {
                            id: newState.member.user.id,
                            allow: ['MANAGE_CHANNELS', 'CONNECT', 'SPEAK']
                        }
                    ]
                }).then(async (c) => {
                    newState.setChannel(c)

                    const voicesList = db.get(`client_${client.user.id}_voiceList`)
                    if(!voicesList) {
                        db.set(`client_${client.user.id}_voiceList`, [`${c.id}`])
                    } else {
                        db.push(`client_${client.user.id}_voiceList`, c.id)
                    }
                })
            }
        }
    }
}