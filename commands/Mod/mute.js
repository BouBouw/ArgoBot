const { Permissions } = require('discord.js');
const db = require("quick.db")

module.exports = {
    name: "mute",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const mutelist = db.get(`client_${client.user.id}_muted`)
    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const user = message.mentions.members.first()
        if(!user) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un membre a rendre muet.`})
    
        const reason = args.slice(1).join(" ") || "Aucune raison fournie"
    
        message.guild.channels.cache.forEach(async (c) => {
            c.permissionOverwrites.create(user, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            })
            .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} une erreur est survenue.`}))
        })
        
        if(!mutelist) {
            db.set(`client_${client.user.id}_muted`, [`${user.id}`])
            await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été correctement rendu muet.`})
        } else {
            if(!mutelist.includes(user.id)) {
                if(db.get(`client_${client.user.id}_muted`) == null) {
                    db.set(`client_${client.user.id}_muted`, [`${user.id}`])
                    await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été correctement rendu muet.`})
                } else {
                    db.push(`client_${client.user.id}_muted`, user.id)
                    await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été correctement rendu muet.`})
                }
            } else {
                await message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) est déjà muet.`})
            }
        }

        await sendLogs();

        async function sendLogs() {
            const ch = db.get(`client_${client.user.id}_logs`)
            const logs = message.guild.channels.cache.get(ch[1])

            await logs.send({
                embeds: [{
                    color: `#32a88b`,
                    description: `[\`MUET\`] ${message.author} (\`${message.author.id}\`) à rendu muet ${user.tag} (\`${user.id}\`)`,
                    author: {
                        name: `${message.author.tag}`,
                        icon_url: `${message.author.avatarURL()}`,
                    },
                    fields: [
                        {
                            name: `Raison`,
                            value: `\`\`\`${reason}\`\`\``
                        }
                    ]
                }]
            })
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const user = message.mentions.members.first()
        if(!user) return message.channel.send({ content: `:x: - ${message.author} please provide a member to mute.`})
    
        const reason = args.slice(1).join(" ") || "No reason given"
    
        message.guild.channels.cache.forEach(async (c) => {
            c.permissionOverwrites.create(user, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            })
            .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} an error has occurred.`}))
        })

        if(!mutelist) {
            db.set(`client_${client.user.id}_muted`, [`${user.id}`])
            await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been correctly muted.`})
        } else {
            if(!mutelist.includes(user.id)) {
                if(db.get(`client_${client.user.id}_muted`) == null) {
                    db.set(`client_${client.user.id}_muted`, [`${user.id}`])
                    await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been correctly muted.`})
                } else {
                    db.push(`client_${client.user.id}_muted`, user.id)
                    await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been correctly muted.`})
                }
            } else {
                await message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) is already muted.`})
            }
        }
    
        await sendLogs();

        async function sendLogs() {
            const ch = db.get(`client_${client.user.id}_logs`)
            const logs = message.guild.channels.cache.get(ch[1])

            await logs.send({
                embeds: [{
                    color: `#32a88b`,
                    description: `[\`MUTE\`] ${message.author} (\`${message.author.id}\`) has been muted ${user.tag} (\`${user.id}\`)`,
                    author: {
                        name: `${message.author.tag}`,
                        icon_url: `${message.author.avatarURL()}`,
                    },
                    fields: [
                        {
                            name: `Reason`,
                            value: `\`\`\`${reason}\`\`\``
                        }
                    ]
                }]
            })
        }
    }
    
    }
}