const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "set-voices",
    aliases: ['setup-voices'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const button = new MessageButton({
        customId: "role",
        label: "",
        style: "SECONDARY",
        emoji: "📌",
      })
      const button_1 = new MessageButton({
        customId: "prefix",
        label: "",
        style: "SECONDARY",
        emoji: "🏷️",
      })
      const button_2 = new MessageButton({
        customId: "channel",
        label: "",
        style: "SECONDARY",
        emoji: "🔊",
      })
      const row = new MessageActionRow({
          components: [ button, button_1, button_2 ]
      })

    if(arr[0] == 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const array = db.get(`client_${client.user.id}_voices`)
        if(!array) {
            message.guild.channels.create(`Vocaux perso.`, {
                type: 'GUILD_CATEGORY'
            }).then(async (cat) => {
                message.guild.channels.create(`Crée ton salon`, {
                    type: 'GUILD_VOICE',
                    parent: cat.id
                }).then(async (c) => {
                    const array = db.get(`client_${client.user.id}_voices`)
                    if(!array) {
                        db.set(`client_${client.user.id}_voices`, [`${cat.id}`])
                        await db.push(`client_${client.user.id}_voices`, c.id)
                        await db.push(`client_${client.user.id}_voices`, '🔊')
                        return message.channel.send({ content: `:white_check_mark: - ${message.author} les salons vocaux personnalisés sont désormais en place.` })
                    } else {
                        array[0] = `${cat.id}`
                        array[1] = `${c.id}`
                        db.set(`client_${client.user.id}_voices`, array)
                        return message.channel.send({ content: `:white_check_mark: - ${message.author} les salons vocaux personnalisés sont désormais en place.` })
                    }
                })
            })
        } else {
            message.channel.send({ content: `${message.author}, vous avez déjà des **vocaux personnalisés** mis en place.\n\n:bulb: • Utilisez \`create\` ou \`edit\` pour créer/modifier des vocaux personnalisés.` })
            if(args[0] == 'create') {
                const categoryDelete = message.guild.channels.cache.get(array[0])
                categoryDelete.delete()
                    .catch((err) => {
                        message.channel.send({ content: `:warning: - ${message.author} salon ${categoryDelete} introuvable.`})
                    })

                const voiceDelete = message.guild.channels.cache.get(array[1])
                voiceDelete.delete()
                    .catch((err) => {
                        message.channel.send({ content: `:warning: - ${message.author} salon ${voiceDelete} introuvable.`})
                    })

                    setTimeout(async () => {
                        message.guild.channels.create(`Vocaux perso.`, {
                            type: 'GUILD_CATEGORY'
                        }).then(async (cat) => {
                            message.guild.channels.create(`Crée ton salon`, {
                                type: 'GUILD_VOICE',
                                parent: cat.id
                            }).then(async (c) => {
                                const array = db.get(`client_${client.user.id}_voices`)
                                if(!array) {
                                    db.set(`client_${client.user.id}_voices`, [`${cat.id}`])
                                    await db.push(`client_${client.user.id}_voices`, c.id)
                                    await db.push(`client_${client.user.id}_voices`, '🔊')
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} les salons vocaux personnalisés sont désormais en place.` })
                                } else {
                                    array[0] = `${cat.id}`
                                    array[1] = `${c.id}`
                                    db.set(`client_${client.user.id}_voices`, array)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} les salons vocaux personnalisés sont désormais en place.` })
                                }
                            })
                        })
                    }, 5000)
            } else if(args[0] == 'edit') {
                const embed = new MessageEmbed()

                embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true}))
                embed.setDescription("`📌` **Modifier le rôle ayant accès**\n`🏷️` **Modifier l'emoji**\n`🔊` **Modifier la salon de création**")
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
                            case 'role': {
                                console.log('.')
                            }

                            case 'prefix': {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel préfix voulez-vous définir pour les salons vocaux personnalisés`})
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const emoji = collected.first().content
                                    array[2] = `${emoji}`
                                    db.set(`client_${client.user.id}_voices`, array)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} le préfix des salons vocaux personnalisés est désormais ${emoji}.` })
                                })
                                awaitButtons()
                                break;
                            }

                            case 'channel': {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel salon voulez-vous définir pour les salons vocaux personnalisés`})
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const channel = message.guild.channels.cache.get(collected.first().content)
                                    if(!channel) return message.channel.send({ content: `:x: - ${message.author} le salon est invalide` })
                                    if(channel.type !== 'GUILD_VOICE') return message.channel.send({ content: `:x: - ${message.author} le salon est invalide` })

                                    array[1] = `${channel.id}`
                                    db.set(`client_${client.user.id}_voices`, array)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} les salons vocaux personnalisés sont désormais en place.` })
                                })
                                awaitButtons()
                                break;
                            }
                        }
                    }
                })
            }
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const array = db.get(`client_${client.user.id}_voices`)
        if(!array) {
            message.guild.channels.create(`Custom voices`, {
                type: 'GUILD_CATEGORY'
            }).then(async (cat) => {
                message.guild.channels.create(`Create your channel`, {
                    type: 'GUILD_VOICE',
                    parent: cat.id
                }).then(async (c) => {
                    const array = db.get(`client_${client.user.id}_voices`)
                    if(!array) {
                        db.set(`client_${client.user.id}_voices`, [`${cat.id}`])
                        await db.push(`client_${client.user.id}_voices`, c.id)
                        await db.push(`client_${client.user.id}_voices`, '🔊')
                        return message.channel.send({ content: `:white_check_mark: - ${message.author} personalized voice channels are now in place.` })
                    } else {
                        array[0] = `${cat.id}`
                        array[1] = `${c.id}`
                        db.set(`client_${client.user.id}_voices`, array)
                        return message.channel.send({ content: `:white_check_mark: - ${message.author} personalized voice channels are now in place.` })
                    }
                })
            })
        } else {
            if(args[0] == 'create') {
                const categoryDelete = message.guild.channels.cache.get(array[0])
                categoryDelete.delete()
                    .catch((err) => {
                        message.channel.send({ content: `:warning: - ${message.author} channel ${categoryDelete} not found.`})
                    })

                const voiceDelete = message.guild.channels.cache.get(array[1])
                voiceDelete.delete()
                    .catch((err) => {
                        message.channel.send({ content: `:warning: - ${message.author} channel ${voiceDelete} not found.`})
                    })

                    setTimeout(async () => {
                        message.guild.channels.create(`Custom voices`, {
                            type: 'GUILD_CATEGORY'
                        }).then(async (cat) => {
                            message.guild.channels.create(`Create your voice`, {
                                type: 'GUILD_VOICE',
                                parent: cat.id
                            }).then(async (c) => {
                                const array = db.get(`client_${client.user.id}_voices`)
                                if(!array) {
                                    db.set(`client_${client.user.id}_voices`, [`${cat.id}`])
                                    await db.push(`client_${client.user.id}_voices`, c.id)
                                    await db.push(`client_${client.user.id}_voices`, '🔊')
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} personalized voice channels are now in place.` })
                                } else {
                                    array[0] = `${cat.id}`
                                    array[1] = `${c.id}`
                                    db.set(`client_${client.user.id}_voices`, array)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} personalized voice channels are now in place.` })
                                }
                            })
                        })
                    }, 5000)
            } else if(args[0] == 'edit') {
                const embed = new MessageEmbed()

                embed.setDescription("`📌` ")

                const channel = message.guild.channels.cache.get(args[1])
                if(!channel) return message.channel.send({ content: `:x: - ${message.author} channel is invalid` })
                if(channel.type !== 'GUILD_VOICE') return message.channel.send({ content: `:x: - ${message.author} channel is invalid` })

                array[1] = `${channel.id}`
                db.set(`client_${client.user.id}_voices`, array)
                return message.channel.send({ content: `:white_check_mark: - ${message.author} personalized voice channels are now in place.` })
            }
        }
    }

    }
}