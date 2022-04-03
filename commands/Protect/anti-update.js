const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "anti-update",
    aliases: ['anti-updates'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const array = db.get(`client_${client.user.id}_security`)
    // Pattern: ['anti-channels', 'anti-roles', 'anti-spam', 'anti-links', 'anti-webhooks', 'anti-joins', 'anti-bots', 'anti-update']

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
        if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        let statut = '';
        if(array[7] == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }

        message.channel.send({
            embeds: [{
                color: `#c48206`,
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Activer/Désactiver l'anti-update**`,
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
                        if(array[7] == 'enable') {
                            array[7] = 'disable'
                            await db.set(`client_${client.user.id}_security`, array)

                            msg.edit({
                                embeds: [{
                                    color: `#c48206`,
                                    title: `Statut: \`❌\``,
                                    description: `\`🔘\` **Activer l'anti-update**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ]
                            })
                        } else {
                            array[7] = 'enable'
                            await db.set(`client_${client.user.id}_security`, array)

                            msg.edit({
                                embeds: [{
                                    color: `#c48206`,
                                    title: `Statut: \`✅\``,
                                    description: `\`🔘\` **Désactiver l'anti-update**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ]
                            })
                        }
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        let statut = '';
        if(array[7] == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }

        message.channel.send({
            embeds: [{
                color: `#c48206`,
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Enable/Disable anti-update**`,
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
                        if(array[7] == 'enable') {
                            array[7] = 'disable'
                            await db.set(`client_${client.user.id}_security`, array)

                            msg.edit({
                                embeds: [{
                                    color: `#c48206`,
                                    title: `Statut: \`❌\``,
                                    description: `\`🔘\` **Enable anti-update**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ]
                            })
                        } else {
                            array[7] = 'enable'
                            await db.set(`client_${client.user.id}_security`, array)

                            msg.edit({
                                embeds: [{
                                    color: `#c48206`,
                                    title: `Statut: \`✅\``,
                                    description: `\`🔘\` **Disable anti-update**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ]
                            })
                        }
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    }

    }
}