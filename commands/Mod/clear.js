const { Permissions } = require('discord.js')
const db = require("quick.db")

module.exports = {
    name: "clear",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const count = Number(args[0])
        if(!count || isNaN(count)) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre de messages à éffacer.`})
        if(count > 99) {
            let countLoop = Math.round(count / 99)
             for(let loop = 0; loop < countLoop; loop++) {
                message.channel.bulkDelete(Math.floor(99 + 1), true).then(() => {
                    if (count == 1) {var s = ""} else {var s = "s"}
                 })
                 .catch((err) => { return; })
             }
             return message.channel.send({ content: `:white_check_mark: - ${message.author} à supprimer **${count} messages**`})
        } else {
            message.channel.bulkDelete(Math.floor(count + 1), true).then(() => {
                if (count == 1) {var s = ""} else {var s = "s"}
             }).then(async () => {
                 message.channel.send({ content: `:white_check_mark: - ${message.author} à supprimer **${count} messages**`})
             })
             .catch((err) => { return; })
        }

        await sendLogs(); 

        async function sendLogs() {
            const ch = db.get(`client_${client.user.id}_logs`)
            const logs = message.guild.channels.cache.get(ch[1])

            await logs.send({
                embeds: [{
                    color: `#32a88b`,
                    description: `[\`MESSAGE\`] ${message.author} (\`${message.author.id}\`) à supprimer **${count}** messages dans ${message.channel} (\`${message.channel.id}\`)`,
                    author: {
                        name: `${message.author.tag}`,
                        icon_url: `${message.author.avatarURL()}`,
                    },
                }]
            })
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const count = Number(args[0])
        if(!count || isNaN(count)) return message.channel.send({ content: `:x: - ${message.author} please provide a number of messages to delete.`})
        
        if(count > 99) {
            let countLoop = Math.round(count / 99)
            for(let loop = 0; loop < countLoop; loop++) {
               message.channel.bulkDelete(Math.floor(99 + 1), true).then(() => {
                   if (count == 1) {var s = ""} else {var s = "s"}
                })
                .catch((err) => { return; })
            }
            return message.channel.send({ content: `:white_check_mark: - ${message.author} to delete **${count} messages**`})
        } else {
            message.channel.bulkDelete(Math.floor(count + 1), true).then(() => {
                if (count == 1) {var s = ""} else {var s = "s"}
             }).then(async () => {
                 message.channel.send({ content: `:white_check_mark: - ${message.author} to delete **${count} messages**`})
             })
             .catch((err) => { return; })
        }

        await sendLogs(); 

        async function sendLogs() {
            const ch = db.get(`client_${client.user.id}_logs`)
            const logs = message.guild.channels.cache.get(ch[1])

            await logs.send({
                embeds: [{
                    color: `#32a88b`,
                    description: `[\`MESSAGE\`] ${message.author} (\`${message.author.id}\`) to delete a **${count}** messages from ${message.channel} (\`${message.channel.id}\`)`,
                    author: {
                        name: `${message.author.tag}`,
                        icon_url: `${message.author.avatarURL()}`,
                    },
                }]
            })
        }
    }

    }
}