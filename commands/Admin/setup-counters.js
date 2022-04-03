const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "set-counters",
    aliases: ['setup-counters'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const array = db.get(`client_${client.user.id}_counters`)
    if(!array) { await db.set(`client_${client.user.id}_counters`, ['disable', 'x']) }
    // pattern: ['statut', 'channelID']

    const menu = new MessageButton({
        customId: "click",
        label: "",
        style: "SECONDARY",
        emoji: "🔘",
    })
    const row = new MessageActionRow({
        components: [ menu ]
    })

    if(arr[0] == 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        let statut = '';
        if(array[0] == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }

        message.channel.send({
            content: `${message.author},`,
            embeds: [{
                color: '#f71b2e',
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Activer/Désactiver le système de compteurs**`,
                author: {
                    name: `${message.author.tag}`,
                    icon_url: `${message.author.avatarURL()}`,
                },
            }],
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

                switch(collected.customId) {
                    case 'click': {
                        if(array[0] == 'enable') {
                            array[0] = 'disable'
                            array[1] = 'x'
                            db.set(`client_${client.user.id}_counters`, array)

                            msg.edit({
                                content: `${message.author},`,
                                embeds: [{
                                    color: '#f71b2e',
                                    title: `Statut: \`❌\``,
                                    description: `\`🔘\` **Activer le système de compteurs**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                }],
                                components: [ row ]
                            })
                        } else {
                            await message.guild.channels.create(`[⚙️] Compteurs`, {
                                type: 'GUILD_VOICE'
                            }).then(async (c) => {
                                c.setPosition(0)

                                array[0] = 'enable'
                                array[1] = `${c.id}`
                                db.set(`client_${client.user.id}_counters`, array)
    
                                msg.edit({
                                    content: `${message.author},`,
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Désactiver le système de compteurs**`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        },
                                    }],
                                    components: [ row ]
                                })
                            })
                        }

                        awaitButtons();
                        break;
                    }
                }
            }
        })

    } else {

    }

    }
}