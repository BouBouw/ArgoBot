const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "voicestats",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const embed = new MessageEmbed()

    const voice = [];
    const muted = [];
    const stream = [];

    let count = 0;

    const button = new MessageButton({
        customId: "voice",
        label: "",
        style: "SECONDARY",
        emoji: "🔊",
    })
    const button_1 = new MessageButton({
        customId: "muted",
        label: "",
        style: "SECONDARY",
        emoji: "🔇",
    })
    const button_2 = new MessageButton({
        customId: "stream",
        label: "",
        style: "SECONDARY",
        emoji: "📹",
    })
    const row = new MessageActionRow({
        components: [ button, button_1, button_2 ]
    })

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const channels = message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE')
        channels.forEach(async (c) => {
            count = count + c.members.size;
            c.members.forEach(async (m) => {
                if(m.user.bot) return;

                if(m.voice.channel) {
                    voice.push(`${m.user} (\`${m.user.id}\`)`)
                }

                if(m.voice.selfDeaf ||m.voice.selfMute) {
                    muted.push(`${m.user} (\`${m.user.id}\`)`)
                }

                if(m.voice.streaming) {
                    stream.push(`${m.user} (\`${m.user.id}\`)`)
                }
            })
        })

        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic : true}))
        embed.setDescription(`Membres total: **${count}**\n\n${voice.join('\n')}`)
        embed.setFooter(client.user.username)

        await message.channel.send({
            content: `${message.author},`,
            embeds: [ embed ],
            components: [ row ]
        }).then(async (msg) => {
            const filter = (interaction) => interaction.user.id === message.author.id && interaction.isButton();
            awaitButtons()

            async function awaitButtons() {
                let collected;
                try {
                    collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
                } catch (err) {
                    if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                        return msg.delete()
                    }
                }
    
                if (!collected.deffered) await collected.deferUpdate();

                switch (collected.customId) {
                    case 'voice': {
                        embed.setDescription(`Membres total: **${count}**\n\n${voice.join('\n')}`)
                        msg.edit({
                            embeds: [ embed ]
                        })
                        awaitButtons()
                        break;
                    }

                    case 'muted': {
                        embed.setDescription(`Membres total: **${count}**\n\n${muted.join('\n')}`)
                        msg.edit({
                            embeds: [ embed ]
                        })
                        awaitButtons()
                        break;
                    }

                    case 'stream': {
                        embed.setDescription(`Membres total: **${count}**\n\n${stream.join('\n')}`)
                        msg.edit({
                            embeds: [ embed ]
                        })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const channels = message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE')
        channels.forEach(async (c) => {
            count = count + c.members.size;
            c.members.forEach(async (m) => {
                if(m.user.bot) return;

                if(m.voice.channel) {
                    voice.push(`${m.user} (\`${m.user.id}\`)`)
                }

                if(m.voice.selfDeaf ||m.voice.selfMute) {
                    muted.push(`${m.user} (\`${m.user.id}\`)`)
                }

                if(m.voice.streaming) {
                    stream.push(`${m.user} (\`${m.user.id}\`)`)
                }
            })
        })

        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic : true}))
        embed.setDescription(`Total members: **${count}**\n\n${voice.join('\n')}`)
        embed.setFooter(client.user.username)

        await message.channel.send({
            content: `${message.author},`,
            embeds: [ embed ],
            components: [ row ]
        }).then(async (msg) => {
            const filter = (interaction) => interaction.user.id === message.author.id && interaction.isButton();
            awaitButtons()

            async function awaitButtons() {
                let collected;
                try {
                    collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
                } catch (err) {
                    if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                        return msg.delete()
                    }
                }
    
                if (!collected.deffered) await collected.deferUpdate();

                switch (collected.customId) {
                    case 'voice': {
                        embed.setDescription(`Total members: **${count}**\n\n${voice.join('\n')}`)
                        msg.edit({
                            embeds: [ embed ]
                        })
                        awaitButtons()
                        break;
                    }

                    case 'muted': {
                        embed.setDescription(`Total members: **${count}**\n\n${muted.join('\n')}`)
                        msg.edit({
                            embeds: [ embed ]
                        })
                        awaitButtons()
                        break;
                    }

                    case 'stream': {
                        embed.setDescription(`Total members: **${count}**\n\n${stream.join('\n')}`)
                        msg.edit({
                            embeds: [ embed ]
                        })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    }

    }
}