const { Permissions } = require('discord.js')
const db = require("quick.db")

module.exports = {
    name: "renew",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        await message.channel.clone()
            .then(async (channel) => {
                channel.setPosition(message.channel.position)
                await message.channel.delete()
                message.channel.send({
                    content: `✅ - ${message.author} le salon à correctement été recrée.`
                })

                await sendLogs(); 

            async function sendLogs() {
                const ch = db.get(`client_${client.user.id}_logs`)
                const logs = message.guild.channels.cache.get(ch[1])

                await logs.send({
                    embeds: [{
                        color: `#32a88b`,
                        description: `[\`SALONS\`] ${message.author} (\`${message.author.id}\`) à recrée le salon ${message.channel}.`,
                        author: {
                            name: `${message.author.tag}`,
                            icon_url: `${message.author.avatarURL()}`,
                        },
                    }]
                })
            }

            })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        await message.channel.clone()
            .then(async (channel) => {
                channel.setPosition(message.channel.position)
                await message.channel.delete()
                message.channel.send({
                    content: `✅ - ${message.author} the channel has been recreated.`
                })
            })

            await sendLogs(); 

            async function sendLogs() {
                const ch = db.get(`client_${client.user.id}_logs`)
                const logs = message.guild.channels.cache.get(ch[1])

                await logs.send({
                    embeds: [{
                        color: `#32a88b`,
                        description: `[\`CHANNELS\`] ${message.author} (\`${message.author.id}\`) has recreated the chnanel ${message.channel}.`,
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