const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "avatar",
    aliases: ['pic'],
    description: "",
execute: async (client, message, args) => {
    const embed = new MessageEmbed()

    const arr = db.get(`global_settings_${client.user.id}`)
    if(arr[0] === 'FR_fr') {
        if(message.mentions.users.first()) {
            const user = message.mentions.users.first();

            const menu = new MessageButton({
                label: "",
                style: "LINK",
                emoji: "🖼️",
                url: `${user.avatarURL({ dynamic: true })}`
            })
            const row = new MessageActionRow({
                components: [ menu ]
            })
    
            embed.setTitle(user.tag)
            embed.setDescription(`[Lien de l'avatar](${user.avatarURL({ dynamic: true })})`)
            embed.setImage(user.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            embed.setFooter(client.user.username)
            embed.setColor('RANDOM')
            message.channel.send({ embeds: [embed], components: [ row ] })
        } else if(args[0]) {
            const user = message.guild.members.cache.get(args[0]).user

            const menu = new MessageButton({
                label: "",
                style: "LINK",
                emoji: "🖼️",
                url: `${user.avatarURL({ dynamic: true })}`
            })
            const row = new MessageActionRow({
                components: [ menu ]
            })
    
            embed.setTitle(user.tag)
            embed.setDescription(`[Lien de l'avatar](${user.avatarURL({ dynamic: true })})`)
            embed.setImage(user.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            embed.setFooter(client.user.username)
            embed.setColor('RANDOM')
            message.channel.send({ embeds: [embed], components: [ row ] })
        } else {
            const user = message.author;

            const menu = new MessageButton({
                label: "",
                style: "LINK",
                emoji: "🖼️",
                url: `${user.avatarURL({ dynamic: true })}`
            })
            const row = new MessageActionRow({
                components: [ menu ]
            })
    
            embed.setTitle(user.tag)
            embed.setDescription(`[Lien de l'avatar](${user.avatarURL({ dynamic: true })})`)
            embed.setImage(user.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            embed.setFooter(client.user.username)
            embed.setColor('RANDOM')
            message.channel.send({ embeds: [embed], components: [ row ] })
        }
    } else {
        if(message.mentions.users.first()) {
            const user = message.mentions.users.first();

            const menu = new MessageButton({
                label: "",
                style: "LINK",
                emoji: "🖼️",
                url: `${user.avatarURL({ dynamic: true })}`
            })
            const row = new MessageActionRow({
                components: [ menu ]
            })
    
            embed.setTitle(user.tag)
            embed.setDescription(`[Lien de l'avatar](${user.avatarURL({ dynamic: true })})`)
            embed.setImage(user.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            embed.setFooter(client.user.username)
            embed.setColor('RANDOM')
            message.channel.send({ embeds: [embed], components: [ row ] })
        } else if(args[0]) {
            const user = message.guild.members.cache.get(args[0]).user

            const menu = new MessageButton({
                label: "",
                style: "LINK",
                emoji: "🖼️",
                url: `${user.avatarURL({ dynamic: true })}`
            })
            const row = new MessageActionRow({
                components: [ menu ]
            })
    
            embed.setTitle(user.tag)
            embed.setDescription(`[Lien de l'avatar](${user.avatarURL({ dynamic: true })})`)
            embed.setImage(user.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            embed.setFooter(client.user.username)
            embed.setColor('RANDOM')
            message.channel.send({ embeds: [embed], components: [ row ] })
        } else {
            const user = message.author;

            const menu = new MessageButton({
                label: "",
                style: "LINK",
                emoji: "🖼️",
                url: `${user.avatarURL({ dynamic: true })}`
            })
            const row = new MessageActionRow({
                components: [ menu ]
            })
    
            embed.setTitle(user.tag)
            embed.setDescription(`[Lien de l'avatar](${user.avatarURL({ dynamic: true })})`)
            embed.setImage(user.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            embed.setFooter(client.user.username)
            embed.setColor('RANDOM')
            message.channel.send({ embeds: [embed], components: [ row ] })
        }
    }

    }
}