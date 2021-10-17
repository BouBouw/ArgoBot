const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "set-logs",
    aliases: ['setup-logs'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] == 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        if(db.get(`client_${client.user.id}_logs`) === null) {
            const category = await message.guild.channels.create('logs', {
                type: "GUILD_CATEGORY"
            }).then(async (cat) => {
                const raid = await message.guild.channels.create('raid', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await raid.send({ content: `:white_check_mark: - Salon de logs défini sur **raid**` })
                await db.set(`client_${client.user.id}_logs`, [`${raid.id}`])

                const mod = await message.guild.channels.create('mod', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await mod.send({ content: `:white_check_mark: - Salon de logs défini sur **mod**` })
                await db.push(`client_${client.user.id}_logs`, mod.id)

                const msg = await message.guild.channels.create('msg', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await msg.send({ content: `:white_check_mark: - Salon de logs défini sur **msg**` })
                await db.push(`client_${client.user.id}_logs`, msg.id)

                const voices = await message.guild.channels.create('voices', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await voices.send({ content: `:white_check_mark: - Salon de logs défini sur **voices**` })
                await db.push(`client_${client.user.id}_logs`, voices.id)

                message.guild.roles.cache.forEach(async (r) => {
                    cat.permissionOverwrites.create(r, {
                        VIEW_CHANNEL: false,
                        SEND_MESSAGES: false,
                        CONNECT: false,
                        ADD_REACTIONS: false
                    })
                })
            })
        } else {
            if(args[0] == 'create') {
                const array = db.get(`client_${client.user.id}_logs`)
                    const raidDelete = message.guild.channels.cache.get(array[0])
                    raidDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} salon ${raidDelete} introuvable.`})
                        })

                    const modDelete = message.guild.channels.cache.get(array[1])
                    modDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} salon ${modDelete} introuvable.`})
                        })

                    const msgDelete = message.guild.channels.cache.get(array[2])
                    msgDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} salon ${msgDelete} introuvable.`})
                        })

                    const voicesDelete = message.guild.channels.cache.get(array[3])
                    voicesDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} salon ${voicesDelete} introuvable.`})
                        })

                        
                        setTimeout(async () => {
                            await db.delete(`client_${client.user.id}_logs`)
                            const category = await message.guild.channels.create('logs', {
                                type: "GUILD_CATEGORY"
                            }).then(async (cat) => {
                                const raid = await message.guild.channels.create('raid', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await raid.send({ content: `:white_check_mark: - Salon de logs défini sur **raid**` })
                                await db.set(`client_${client.user.id}_logs`, [`${raid.id}`])
                
                                const mod = await message.guild.channels.create('mod', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await mod.send({ content: `:white_check_mark: - Salon de logs défini sur **mod**` })
                                await db.push(`client_${client.user.id}_logs`, mod.id)
                
                                const msg = await message.guild.channels.create('msg', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await msg.send({ content: `:white_check_mark: - Salon de logs défini sur **msg**` })
                                await db.push(`client_${client.user.id}_logs`, msg.id)
                
                                const voices = await message.guild.channels.create('voices', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await voices.send({ content: `:white_check_mark: - Salon de logs défini sur **voices**` })
                                await db.push(`client_${client.user.id}_logs`, voices.id)
                
                                message.guild.roles.cache.forEach(async (r) => {
                                    cat.permissionOverwrites.create(r, {
                                        VIEW_CHANNEL: false,
                                        SEND_MESSAGES: false,
                                        CONNECT: false,
                                        ADD_REACTIONS: false
                                    })
                                })
                            })
                        }, 5000)
            } else if(args[0] == 'edit') {
                const array = db.get(`client_${client.user.id}_logs`)
                switch(args[1]) {
                    case 'raid': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon valide.` })

                        await channel.send({ content: `:white_check_mark: - Salon de logs défini sur **raid**` })
                        array[0] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }

                    case 'mod': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon valide.` })

                        await channel.send({ content: `:white_check_mark: - Salon de logs défini sur **mod**` })
                        array[1] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }

                    case 'msg': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon valide.` })

                        await channel.send({ content: `:white_check_mark: - Salon de logs défini sur **msg**` })
                        array[2] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }

                    case 'voices': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} veuillez mentionner un salon valide.` })

                        await channel.send({ content: `:white_check_mark: - Salon de logs défini sur **voices**` })
                        array[3] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }
                }
            }
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        if(db.get(`client_${client.user.id}_logs`) === null) {
            const category = await message.guild.channels.create('logs', {
                type: "GUILD_CATEGORY"
            }).then(async (cat) => {
                const raid = await message.guild.channels.create('raid', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await raid.send({ content: `:white_check_mark: - Log channel set to **raid**` })
                await db.set(`client_${client.user.id}_logs`, [`${raid.id}`])

                const mod = await message.guild.channels.create('mod', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await mod.send({ content: `:white_check_mark: - Log channel set to **mod**` })
                await db.push(`client_${client.user.id}_logs`, mod.id)

                const msg = await message.guild.channels.create('msg', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await msg.send({ content: `:white_check_mark: - Log channel set to **msg**` })
                await db.push(`client_${client.user.id}_logs`, msg.id)

                const voices = await message.guild.channels.create('voices', {
                    type: "GUILD_TEXT",
                    parent: cat.id
                })

                await voices.send({ content: `:white_check_mark: - Log channel set to **voices**` })
                await db.push(`client_${client.user.id}_logs`, voices.id)

                message.guild.roles.cache.forEach(async (r) => {
                    cat.permissionOverwrites.create(r, {
                        VIEW_CHANNEL: false,
                        SEND_MESSAGES: false,
                        CONNECT: false,
                        ADD_REACTIONS: false
                    })
                })
            })
        } else {
            if(args[0] == 'create') {
                const array = db.get(`client_${client.user.id}_logs`)
                    const raidDelete = message.guild.channels.cache.get(array[0])
                    raidDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} channel ${raidDelete} not found.`})
                        })

                    const modDelete = message.guild.channels.cache.get(array[1])
                    modDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} channel ${modDelete} not found.`})
                        })

                    const msgDelete = message.guild.channels.cache.get(array[2])
                    msgDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} channel ${msgDelete} not found.`})
                        })

                    const voicesDelete = message.guild.channels.cache.get(array[3])
                    voicesDelete.delete()
                        .catch((err) => {
                            message.channel.send({ content: `:warning: - ${message.author} channel ${voicesDelete} not found.`})
                        })

                        
                        setTimeout(async () => {
                            await db.delete(`client_${client.user.id}_logs`)
                            const category = await message.guild.channels.create('logs', {
                                type: "GUILD_CATEGORY"
                            }).then(async (cat) => {
                                const raid = await message.guild.channels.create('raid', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await raid.send({ content: `:white_check_mark: - Log channel set to **raid**` })
                                await db.set(`client_${client.user.id}_logs`, [`${raid.id}`])
                
                                const mod = await message.guild.channels.create('mod', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await mod.send({ content: `:white_check_mark: - Log channel set to **mod**` })
                                await db.push(`client_${client.user.id}_logs`, mod.id)
                
                                const msg = await message.guild.channels.create('msg', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await msg.send({ content: `:white_check_mark: - Log channel set to **msg**` })
                                await db.push(`client_${client.user.id}_logs`, msg.id)
                
                                const voices = await message.guild.channels.create('voices', {
                                    type: "GUILD_TEXT",
                                    parent: cat.id
                                })
                
                                await voices.send({ content: `:white_check_mark: - Log channel set to **voices**` })
                                await db.push(`client_${client.user.id}_logs`, voices.id)
                
                                message.guild.roles.cache.forEach(async (r) => {
                                    cat.permissionOverwrites.create(r, {
                                        VIEW_CHANNEL: false,
                                        SEND_MESSAGES: false,
                                        CONNECT: false,
                                        ADD_REACTIONS: false
                                    })
                                })
                            })
                        }, 5000)
            } else if(args[0] == 'edit') {
                const array = db.get(`client_${client.user.id}_logs`)
                switch(args[1]) {
                    case 'raid': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} please mention a channel.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} please mention a valid channel.` })

                        await channel.send({ content: `:white_check_mark: - Log channel set to **raid**` })
                        array[0] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }

                    case 'mod': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} please mention a channel.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} please mention a valid channel.` })

                        await channel.send({ content: `:white_check_mark: - Log channel set to **mod**` })
                        array[1] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }

                    case 'msg': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} please mention a channel.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} please mention a valid channel.` })

                        await channel.send({ content: `:white_check_mark: - Log channel set to **msg**` })
                        array[2] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }

                    case 'voices': {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])
                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} please mention a channel.`})
                        if(channel.type !== 'GUILD_TEXT') return message.channel.send({ content: `:x: - ${message.author} please mention a valid channel.` })

                        await channel.send({ content: `:white_check_mark: - Log channel set to **voices**` })
                        array[3] = `${channel.id}`
                        db.set(`client_${client.user.id}_logs`, array)
                    }
                }
            }
        }
    }

    }
}