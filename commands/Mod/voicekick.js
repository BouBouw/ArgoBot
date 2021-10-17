const { Permissions } = require('discord.js');

module.exports = {
    name: "voicekick",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send({ content: `:x: - ${message.author} vous n'êtes pas dans un salon vocal.` })
    
        channel.members.forEach(async (m) => {
            m.voice.kick()
        })
        await message.channel.send({ content: `:white_check_mark: - ${message.author} tous les utilisateurs de \`${channel.name}\` ont été déconnecté(s).`})
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send({ content: `:x: - ${message.author} you are not in a voice channel.` })
    
        channel.members.forEach(async (m) => {
            m.voice.kick()
        })
        await message.channel.send({ content: `:white_check_mark: - ${message.author} all users of \`${channel.name}\` have been disconnected.`})
    }

    }
}