const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "setup-presence",
    aliases: ['set-presence'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const array = db.get(`client_${client.user.id}_presence`)
    // Pattern: ['status', 'presence', 'role']

    const menu = new MessageButton({
        customId: "click",
        label: "",
        style: "SECONDARY",
        emoji: "🔘",
    })
    const row = new MessageActionRow({
      components: [ menu ]
    })

    switch(arr[0]) {
        case 'FR_fr': {
            if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

            let statut = '';
            if(array[0] == 'enable') {
                statut = '✅'
            } else {
                statut = '❌'
            }

            message.channel.send({
                embeds: [{
                    color: `#f71b2e`,
                    title: `Statut: \`${statut}\``,
                    description: `\`🔘\` **Activer/Désactiver la présence status**`,
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
                                await db.set(`client_${client.user.id}_presence`, ['disable', 'x', 'x'])
                            } else {
                                if(array[0] == 'enable') {
                                    array[0] = 'disable'
                                    db.set(`client_${client.user.id}_presence`, array)

                                    msg.edit({
                                        embeds: [{
                                            color: `#f71b2e`,
                                            title: `Statut: \`❌\``,
                                            description: `\`🔘\` **Activer la présence status**`,
                                            author: {
                                                name: `${message.author.tag}`,
                                                icon_url: `${message.author.avatarURL()}`,
                                            }, 
                                        }],
                                        components: [ row ],
                                    })
                                } else {
                                    array[0] = 'enable'
                                    db.set(`client_${client.user.id}_presence`, array)

                                    msg.edit({
                                        embeds: [{
                                            color: `#f71b2e`,
                                            title: `Statut: \`✅\``,
                                            description: `\`🔘\` **Désactiver la présence status**`,
                                            author: {
                                                name: `${message.author.tag}`,
                                                icon_url: `${message.author.avatarURL()}`,
                                            }, 
                                        }],
                                        components: [ row ],
                                    }).then(async () => {
                                        await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez mettre le mot/phrase nécessaire dans le status.` }).then(async (m) => {
                                            const filter = (m) => m.author.id ===  message.author.id;
                                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                                await m.delete();
                                                collected.first().delete();

                                                const text = collected.first().content;
                                                if(!text) return;

                                                array[1] = `${text}`
                                                await db.set(`client_${client.user.id}_presence`, array)

                                                await message.channel.send({
                                                    content: `:hourglass_flowing_sand: - ${message.author} veuillez mentionner ou donner l'identifiant du rôle d'ajout de status.`
                                                }).then(async (m_2) => {
                                                    message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected_1) => {
                                                        await m_2.delete();
                                                        collected_1.first().delete();

                                                        const role = message.guild.roles.cache.get(collected_1.first().content) || collected_1.first().mentions.roles.first()
                                                        if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle invalide.`})

                                                        array[2] = `${role.id}`
                                                        await db.set(`client_${client.user.id}_presence`, array)
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }
                            }

                            awaitButtons();
                            break;
                        }
                    }
                }
            })
            break;
        }

        case 'EN_en': {
            if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

            let statut = '';
            if(array[0] == 'enable') {
                statut = '✅'
            } else {
                statut = '❌'
            }

            message.channel.send({
                embeds: [{
                    color: `#f71b2e`,
                    title: `Statut: \`${statut}\``,
                    description: `\`🔘\` **Enable/Disable status presence**`,
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
                                await db.set(`client_${client.user.id}_presence`, ['disable', 'x', 'x'])
                            } else {
                                if(array[0] == 'enable') {
                                    array[0] = 'disable'
                                    db.set(`client_${client.user.id}_presence`, array)

                                    msg.edit({
                                        embeds: [{
                                            color: `#f71b2e`,
                                            title: `Statut: \`❌\``,
                                            description: `\`🔘\` **Enable presence status**`,
                                            author: {
                                                name: `${message.author.tag}`,
                                                icon_url: `${message.author.avatarURL()}`,
                                            }, 
                                        }],
                                        components: [ row ],
                                    })
                                } else {
                                    array[0] = 'enable'
                                    db.set(`client_${client.user.id}_presence`, array)

                                    msg.edit({
                                        embeds: [{
                                            color: `#f71b2e`,
                                            title: `Statut: \`✅\``,
                                            description: `\`🔘\` **Disable presence status**`,
                                            author: {
                                                name: `${message.author.tag}`,
                                                icon_url: `${message.author.avatarURL()}`,
                                            }, 
                                        }],
                                        components: [ row ],
                                    }).then(async () => {
                                        await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please put the necessary word/phrase in the status.` }).then(async (m) => {
                                            const filter = (m) => m.author.id ===  message.author.id;
                                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                                await m.delete();
                                                collected.first().delete();

                                                const text = collected.first().content;
                                                if(!text) return;

                                                array[1] = `${text}`
                                                await db.set(`client_${client.user.id}_presence`, array)

                                                await message.channel.send({
                                                    content: `:hourglass_flowing_sand: - ${message.author} please mention or give the add status role id.`
                                                }).then(async (m_2) => {
                                                    message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected_1) => {
                                                        await m_2.delete();
                                                        collected_1.first().delete();

                                                        const role = message.guild.roles.cache.get(collected_1.first().content) || collected_1.first().mentions.roles.first()
                                                        if(!role) return message.channel.send({ content: `:x: - ${message.author} invalid role.`})

                                                        array[2] = `${role.id}`
                                                        await db.set(`client_${client.user.id}_presence`, array)
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }
                            }

                            awaitButtons();
                            break;
                        }
                    }
                }
            })
            break;
        }
    }

    }
}