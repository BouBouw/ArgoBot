const { Permissions } = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: "voicemove",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send({ content: `:x: - ${message.author} vous n'êtes pas dans un salon vocal.` })
    
        const id = args[0]
        if(!id) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un identifiant de salon.`})
        const channelMove = message.guild.channels.cache.get(id)
    
        channel.members.forEach(async (m) => {
            m.voice.setChannel(channelMove)
        })
        await message.channel.send({ content: `:white_check_mark: - ${message.author} tous les utilisateurs de \`${channel.name}\` ont été déplacés vers \`${channelMove.name}\`.`})
        
        await sendLogs();

        async function sendLogs() {
            const ch = db.get(`client_${client.user.id}_logs`)
            const logs = message.guild.channels.cache.get(ch[3])

            await logs.send({
                embeds: [{
                    color: `#32a88b`,
                    description: `[\`VOCAUX\`] ${message.author} (\`${message.author.id}\`) à déplacer tous les utilisateur de ${channel} (\`${channel.id}\`) dans le salon ${channelMove} (\`${channelMove.id}\`)`,
                    author: {
                        name: `${message.author.tag}`,
                        icon_url: `${message.author.avatarURL()}`,
                    },
                }]
            })
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send({ content: `:x: - ${message.author} you are not in a voice channel.` })
    
        const id = args[0]
        if(!id) return message.channel.send({ content: `:x: - ${message.author} please provide a channel ID.`})
        const channelMove = message.guild.channels.cache.get(id)
    
        channel.members.forEach(async (m) => {
            m.voice.setChannel(channelMove)
        })
        await message.channel.send({ content: `:white_check_mark: - ${message.author} all users of \`${channel.name}\` have been moved to \`${channelMove.name}\`.`})

        await sendLogs();

        async function sendLogs() {
            const ch = db.get(`client_${client.user.id}_logs`)
            const logs = message.guild.channels.cache.get(ch[3])

            await logs.send({
                embeds: [{
                    color: `#32a88b`,
                    description: `[\`VOICE\`] ${message.author} (\`${message.author.id}\`) has been mooved all members to ${channel} (\`${channel.id}\`) in ${channelMove} (\`${channelMove.id}\`)`,
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