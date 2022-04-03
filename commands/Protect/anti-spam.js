const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "anti-spam",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const array = db.get(`client_${client.user.id}_security`)
    // Pattern: ['anti-channels', 'anti-roles', 'anti-spam', 'anti-links', 'anti-webhooks', 'anti-joins', 'anti-bots']

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
        if(array[2] == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }
    
        message.channel.send({
            embeds: [{
                color: `#c48206`,
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Activer/Désactiver l'anti-spam**`,
                author: {
                    name: `${message.author.tag}`,
                    icon_url: `${message.author.avatarURL()}`,
                }, 
            }],
            components: [ row ],
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
                        if(!array) {
                            await db.set(`client_${client.user.id}_security`, ['disable', 'disable', 'disable', 'disable', 'disable', 'disable', 'disable'])
                        } else {
                            if(array[2] == 'enable') {
                                array[2] = 'disbale'
                                db.set(`client_${client.user.id}_security`, array)

                                msg.edit({
                                    embeds: [{
                                        color: `#c48206`,
                                        title: `Statut: \`❌\``,
                                        description: `\`🔘\` **Activer l'anti-spam**`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        }, 
                                    }],
                                    components: [ row ], 
                                })
                            } else {
                                array[2] = 'enable'
                                db.set(`client_${client.user.id}_security`, array)

                                msg.edit({
                                    embeds: [{
                                        color: `#c48206`,
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Désactiver l'anti-spam**`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        }, 
                                    }],
                                    components: [ row ], 
                                })
                            }
                        }

                        awaitButtons();
                        break;
                    }
                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        let statut = '';
        if(array[2] == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }
    
        message.channel.send({
            embeds: [{
                color: `#c48206`,
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Enable/Disable anti-spam**`,
                author: {
                    name: `${message.author.tag}`,
                    icon_url: `${message.author.avatarURL()}`,
                }, 
            }],
            components: [ row ],
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
                        if(!array) {
                            await db.set(`client_${client.user.id}_security`, ['disable', 'disable', 'disable', 'disable', 'disable', 'disable', 'disable'])
                        } else {
                            if(array[2] == 'enable') {
                                array[2] = 'disbale'
                                db.set(`client_${client.user.id}_security`, array)

                                msg.edit({
                                    embeds: [{
                                        color: `#c48206`,
                                        title: `Statut: \`❌\``,
                                        description: `\`🔘\` **Enable anti-spam**`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        }, 
                                    }],
                                    components: [ row ], 
                                })
                            } else {
                                array[2] = 'enable'
                                db.set(`client_${client.user.id}_security`, array)

                                msg.edit({
                                    embeds: [{
                                        color: `#c48206`,
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Disable anti-spam**`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        }, 
                                    }],
                                    components: [ row ], 
                                })
                            }
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