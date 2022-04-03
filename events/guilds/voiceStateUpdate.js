const db = require('quick.db');

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    execute: async (oldState, newState, client) => {
        const arr = db.get(`global_settings_${client.user.id}`)

        const array2 = db.get(`client_${client.user.id}_logs`)
        if(!array2) return;
        const logs = client.channels.cache.get(array2[3])

        const array = db.get(`client_${client.user.id}_voices`)
        if(!array) return;

        await customVoices();
        await sendLogs();

        async function customVoices() {
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

        async function sendLogs() {
            if(!oldState.channel && newState.channel) {
                switch(arr[0]) {
                    case 'FR_fr': {
                        await logs.send({
                            embeds: [{
                                color: '#32a88b',
                                description: `[\`VOCAUX\`] ${newState.member.user} (\`${newState.member.user.id}\`) vient de rejoindre un salon vocal`,
                                author: {
                                    name: `${newState.member.user.tag}`,
                                    icon_url: `${newState.member.user.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `Salon:`,
                                        value: `Nom: ${newState.channel} \nIdentifiant: \`${newState.channel.id}\``
                                    }
                                ]
                            }]
                        })
                        break;
                    }

                    case 'EN_en': {
                        await logs.send({
                            embeds: [{
                                color: '#32a88b',
                                description: `[\`VOICES\`] ${newState.member.user} (\`${newState.member.user.id}\`) just joined a voice channel`,
                                author: {
                                    name: `${newState.member.user.tag}`,
                                    icon_url: `${newState.member.user.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `Channel:`,
                                        value: `Name: ${newState.channel} \nIdentifiant: \`${newState.channel.id}\``
                                    }
                                ]
                            }]
                        })
                        break;
                    }
                }
            }

            if(oldState.channel && newState.channel) {
                switch(arr[0]) {
                    case 'FR_fr': {
                        await logs.send({
                            embeds: [{
                                color: '#32a88b',
                                description: `[\`VOCAUX\`] ${newState.member.user} (\`${newState.member.user.id}\`) vient de ce déplacer de salon`,
                                author: {
                                    name: `${newState.member.user.tag}`,
                                    icon_url: `${newState.member.user.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `Channel précédant:`,
                                        value: `Nom: ${oldState.channel} \nIdentifiant: \`${oldState.channel.id}\``
                                    },
                                    {
                                        name: `Channel suivant:`,
                                        value: `Nom: ${newState.channel} \nIdentifiant: \`${newState.channel.id}\``
                                    }
                                ]
                            }]
                        })
                        break;
                    }

                    case 'EN_en': {
                        await logs.send({
                            embeds: [{
                                color: '#32a88b',
                                description: `[\`VOICES\`] ${newState.member.user} (\`${newState.member.user}\`) just mooved to voice channel`,
                                author: {
                                    name: `${newState.member.user.tag}`,
                                    icon_url: `${newState.member.user.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `Channel Before:`,
                                        value: `Name: ${oldState.channel} \nIdentifiant: \`${oldState.channel.id}\``
                                    },
                                    {
                                        name: `Channel After`,
                                        value: `Name: ${newState.channel} \nIdentifiant: \`${newState.channel.id}\``
                                    }
                                ]
                            }]
                        })
                        break;
                    }
                }
            }

            if(oldState.channel && !newState.channel) {
                switch(arr[0]) {
                    case 'FR_fr': {
                        await logs.send({
                            embeds: [{
                                color: '#32a88b',
                                description: `[\`VOCAUX\`] ${oldState.member.user} (\`${oldState.member.user.id}\`) vient de ce déconnecter d'un salon`,
                                author: {
                                    name: `${oldState.member.user.tag}`,
                                    icon_url: `${oldState.member.user.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `Salon:`,
                                        value: `Nom: ${oldState.channel} \nIdentifiant: \`${oldState.channel.id}\``
                                    },
                                ]
                            }]
                        })
                        break;
                    }

                    case 'EN_en': {
                        await logs.send({
                            embeds: [{
                                color: '#32a88b',
                                description: `[\`VOICES\`] ${oldState.member.user} (\`${oldState.member.user.id}\`) just disconnect to voice channel`,
                                author: {
                                    name: `${oldState.member.user.tag}`,
                                    icon_url: `${oldState.member.user.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `Channel:`,
                                        value: `Name: ${oldState.channel} \nIdentifiant: \`${oldState.channel.id}\``
                                    },
                                ]
                            }]
                        })
                        break;
                    }
                }
            }

        }

    }
}