const { Permissions } = require('discord.js');
const db = require("quick.db")

module.exports = {
    name: "unmute",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const mutelist = db.get(`client_${client.user.id}_muted`)

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const user = message.mentions.members.first()
        if(!user) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un membre a rendre la parole.`})
    
        message.guild.channels.cache.forEach(async (c) => {
            c.permissionOverwrites.edit(user, {
                SEND_MESSAGES: null,
                CONNECT: null,
                ADD_REACTIONS: null
            })
            .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} une erreur est survenue.`}))
        })

        if(!mutelist) {
            await message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) n'est pas muet` })
        } else {
            if(!mutelist.includes(user.id)) {
                await message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) n'est pas muet` })
            } else {
                const filtered = mutelist.filter(id => id !== user.id);
                db.set(`client_${client.user.id}_muted`, filtered)
                await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été correctement accès à la parole.`})
            }
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const user = message.mentions.members.first()
        if(!user) return message.channel.send({ content: `:x: - ${message.author} please provide a member to speak.`})
    
        message.guild.channels.cache.forEach(async (c) => {
            c.permissionOverwrites.edit(user, {
                SEND_MESSAGES: null,
                CONNECT: null,
                ADD_REACTIONS: null
            })
            .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} an error has occurred.`}))
        })

        if(!mutelist) {
            await message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) is not muted` })
        } else {
            if(!mutelist.includes(user.id)) {
                await message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) is not muted` })
            } else {
                const filtered = mutelist.filter(id => id !== user.id);
                db.set(`client_${client.user.id}_muted`, filtered)
                await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been correctly unmuted.`})
            }
        }
    }

    }
}