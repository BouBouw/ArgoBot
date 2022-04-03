const prettyMilliseconds = require('pretty-ms');
const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require("quick.db")
const ms = require('ms')
const ms2 = require('parse-ms');

module.exports = {
    name: "giveaways",
    aliases: ['giveaway'],
    description: "",
execute: async (client, message, args) => {
    await db.set(`giveaways_settings_${client.user.id}`, ['Aucun temps', 'Aucun salon', 'Aucun gagant', 'Aucun gain', `${Date.now()}`])
    let win = []
    const arr = db.get(`global_settings_${client.user.id}`)

    let giveaway = db.get(`giveaways_settings_${client.user.id}`)

    const button = new MessageButton({
        customId: "list",
        label: "",
        style: "SUCCESS",
        emoji: "📑",
      })
    const button_1 = new MessageButton({
        customId: "create",
        label: "",
        style: "SECONDARY",
        emoji: "🎊",
      })
      const button_2 = new MessageButton({
        customId: "edit",
        label: "",
        style: "SECONDARY",
        emoji: "✏️",
      })
      const button_3 = new MessageButton({
        customId: "cancel",
        label: "",
        style: "DANGER",
        emoji: "🗑️",
      })
      const row = new MessageActionRow({
        components: [ button, button_1, button_2, button_3 ]
    })

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        await message.channel.send({
            embeds: [{
                color: '6b32a8',
                title: `Giveaway's`,
                description: "`📑` **Voir la liste des giveaways en cours**\n\n`🎊` **Créer un giveaway**\n`✏️` **Editer un giveaway**\n\n`🗑️` **Annuler un giveaway**",
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
                    case 'create': {

                        const button_4 = new MessageButton({
                            customId: "time",
                            label: "",
                            style: "SECONDARY",
                            emoji: "⏰",
                          })
                          const button_5 = new MessageButton({
                            customId: "channel",
                            label: "",
                            style: "SECONDARY",
                            emoji: "📨",
                          })
                          const button_6 = new MessageButton({
                            customId: "winners",
                            label: "",
                            style: "SECONDARY",
                            emoji: "👤",
                          })
                          const button_7 = new MessageButton({
                            customId: "price",
                            label: "",
                            style: "SECONDARY",
                            emoji: "🎁",
                          })
                          const row_1 = new MessageActionRow({
                            components: [ button_4, button_5, button_6, button_7 ]
                        })

                        msg.edit({
                            content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                            embeds: [{
                                color: '6b32a8',
                                title: "Giveaway's > Création d'un giveaway",
                                // temps, salon, gain, nombre de gagnants
                                author: {
                                    name: `${message.author.tag}`,
                                    icon_url: `${message.author.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `⏰ Temps:`,
                                        value: `${giveaway[0] || 'Aucun temps'}`,
                                    },
                                    {
                                        name: `📨 Salon:`,
                                        value: `${giveaway[1] || 'Aucun salon'}`,
                                    },
                                    {
                                        name: `👤 Gagnant:`,
                                        value: `${giveaway[2] || 'Aucun gagnant'}`,
                                    },
                                    {
                                        name: `🎁 Gain:`,
                                        value: `${giveaway[3] || 'Aucun gain'}`,
                                    },
                                ]
                            }],
                            components: [ row_1 ]
                        })
                        awaitButtons();
                        break;
                    }

                    case 'edit': {
                        awaitButtons();
                        break;
                    }

                    case 'cancel': {
                        awaitButtons();
                        break;
                    }

                    case 'list': {
                        awaitButtons();
                        break;
                    }


                        case 'time': {

                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            msg.edit({
                                content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `En attente du nouveau temps...`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'Aucun salon'}`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `${giveaway[2] || 'Aucun gagnant'}`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `${giveaway[3] || 'Aucun gain'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    
                                    let time = ms(collected.first().content)
                                    if(!Number(time) || isNaN(time)) return message.channel.send({ content: `:x: - ${message.author} temps invalide.`}).then(async (err) => {
                                        setTimeout(async () => {
                                            await err.delete();
                                        }, 5000)
                                    })
                                    giveaway[0] = `${time}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                    let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))
                                await msg.edit({
                                    content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'Aucun salon'}`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `${giveaway[2] || 'Aucun gagnant'}`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `${giveaway[3] || 'Aucun gain'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'channel': {
                            
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            msg.edit({
                                content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `En attente du nouveau salon d'envois...`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `${giveaway[2] || 'Aucun gagnant'}`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `${giveaway[3] || 'Aucun gain'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                                    if(!channel) return message.channel.send({ content: `:x: - ${message.author} salon invalide.`}).then(async (err) => {
                                        setTimeout(async () => {
                                            await err.delete();
                                        }, 5000)
                                    })
                                    giveaway[1] = `${channel.id}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                await msg.edit({
                                    content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `${client.channels.cache.get(newGiveaway[1]) || 'Aucun salon'}`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `${giveaway[2] || 'Aucun gagnant'}`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `${giveaway[3] || 'Aucun gain'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'winners': {
                               
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            msg.edit({
                                content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'Aucun salon'}`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `En attente du nombre de gagnant...`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `${giveaway[3] || 'Aucun gain'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    const winners = collected.first().content
                                    if(!Number(winners) && isNaN(winners)) return message.channel.send({ content: `:x: - ${message.author} nombre de gagnant invalide.`}).then(async (err) => {
                                        setTimeout(async () => {
                                            await err.delete();
                                        }, 5000)
                                    })
                                    giveaway[2] = `${winners}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                await msg.edit({
                                    content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `${client.channels.cache.get(newGiveaway[1]) || 'Aucun salon'}`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `${newGiveaway[2] || 'Aucun gagnant'}`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `${giveaway[3] || 'Aucun gain'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'price': {
    
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            msg.edit({
                                content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'Aucun salon'}`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `${giveaway[2] || 'Aucun gagnant'}`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `En attente du gain...`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    const price = collected.first().content

                                    giveaway[3] = `${price}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                await msg.edit({
                                    content: "↳ ⏰ - **Modifier le temps**\n↳ 📨 - **Modifier le salon d'envois**\n↳ 👤 - **Modifier le nombre de gagnant**\n↳ 🎁 - **Modifier le gain**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Création d'un giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Temps:`,
                                            value: `${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)`,
                                        },
                                        {
                                            name: `📨 Salon:`,
                                            value: `${client.channels.cache.get(newGiveaway[1]) || 'Aucun salon'}`,
                                        },
                                        {
                                            name: `👤 Gagnant:`,
                                            value: `${newGiveaway[2] || 'Aucun gagnant'}`,
                                        },
                                        {
                                            name: `🎁 Gain:`,
                                            value: `${newGiveaway[3] || 'Aucun gain'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'send': {
                            
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            if(giveaway[0] == 'Aucun temps') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} paramètre \`Temps\` invalide.`
                                })
                            } else if(giveaway[1] == 'Aucun salon') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} paramètre \`Salon\` invalide.`
                                })
                            } else if(giveaway[2] == 'Aucun gagnant') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} paramètre \`Gagnant\` invalide.`
                                })
                            } else if(giveaway[3] == 'Aucun gain') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} paramètre \`Gain\` invalide.`
                                })
                            } else {
                                const channel = client.channels.cache.get(giveaway[1])
                                channel.send({
                                    embeds: [{
                                        color: '6b32a8',
                                        title: `Giveaway's`,
                                        description: `🎁 | **__${giveaway[3]}__**\n↳ Lancé par ${message.author}\n\n⏰ • **Temps restant:** \`${newTime.days} jour(s), ${newTime.hours} heure(s), ${newTime.minutes} minute(s), ${newTime.seconds} seconde(s)\``
                                    }]
                                }).then(async (g) => {
                                    const emojis = '🎉'
                                    await g.react(emojis)

                                    var interval = setInterval(timer, 10000);
                                    async function timer() {
                                        let timeRemaining = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                                        let emojisCount = g.reactions.cache.get(emojis).count;

                                        g.edit({
                                            embeds: [{
                                                color: '6b32a8',
                                                title: `Giveaway's`,
                                                description: `🎁 | **__${giveaway[3]}__**\n↳ Lancé par ${message.author} [\`${emojisCount}\` participant(s)]\n\n⏰ • **Temps restant:** \`${timeRemaining.days} jour(s), ${timeRemaining.hours} heure(s), ${timeRemaining.minutes} minute(s), ${timeRemaining.seconds} seconde(s)\``
                                            }]
                                        })

                                        if(timeRemaining.seconds < 0) {
                                            console.log(g.reactions.cache.get(emojis))
                                            let win = []
                                            //let finalWin = 'x'

                                            const users = message.guild.members.cache
                                             const filter = (reaction, user) => {
                                                 return reaction.emoji.name === '🎉' && user.id === message.author.id;
                                             };
                                             const collector = g.createReactionCollector({ filter: filter, time: giveaway[0] });

                                             collector.on('collect', (reaction, user) => {
                                                 console.log(user.id + " react")
                                                 win.push(user.id)
                                             })

                                            const finalWin = message.guild.members.cache.get(win[Math.floor(win.length * Math.random())])

                                            g.edit({
                                                embeds: [{
                                                    color: '6b32a8',
                                                    title: `Giveaway's`,
                                                    description: `🎊 Giveaway terminé 🎊\n↳ Lancé par ${message.author}\n\nLe giveaway à été **gagner** par ${finalWin}\n\n**${emojisCount}** participant(s)`
                                                }]
                                            })
                                            await message.channel.send({
                                                content: `:tada: • Bien joué ${finalWin}, tu remporte **${giveaway[3]}** avec le giveaways de \`${message.author.tag}\`.\n\n» https://discord.com/channels/${g.guild.id}/${g.channel.id}/${g.id}`
                                            })
                                            await clearInterval(interval)
                                        }
                                    }
                                })
                            }

                            awaitButtons();
                            break;
                        }
                }
            }
        })

        /*switch(args[0]) {
            case 'cancel': {
                const msgId = args[1]
                    if(db.get(`client_${client.user.id}_giveaway_${msgId}`)) {
                        message.guild.channels.cache.forEach(async (c) => {
                            await c.fetchMessages(msgId)
                                .then(async (msg) => {
                                    console.log('message trouvé')
                                })
                                .catch((err) => {
                                    return;
                                })
                        })
                    } else {
                        message.channel.send({
                            content: `:x: - ${message.author} giveaway introuvable`
                        })
                    }
                break;
            }

            case 'edit': {

            }
        }*/
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        await message.channel.send({
            embeds: [{
                color: '6b32a8',
                title: `Giveaway's`,
                description: "`📑` **Show giveaways list**\n\n`🎊` **Create giveaway**\n`✏️` **Edit giveaway**\n\n`🗑️` **Cancel giveaway**",
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
                    case 'create': {

                        const button_4 = new MessageButton({
                            customId: "time",
                            label: "",
                            style: "SECONDARY",
                            emoji: "⏰",
                          })
                          const button_5 = new MessageButton({
                            customId: "channel",
                            label: "",
                            style: "SECONDARY",
                            emoji: "📨",
                          })
                          const button_6 = new MessageButton({
                            customId: "winners",
                            label: "",
                            style: "SECONDARY",
                            emoji: "👤",
                          })
                          const button_7 = new MessageButton({
                            customId: "price",
                            label: "",
                            style: "SECONDARY",
                            emoji: "🎁",
                          })
                          const row_1 = new MessageActionRow({
                            components: [ button_4, button_5, button_6, button_7 ]
                        })

                        msg.edit({
                            content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                            embeds: [{
                                color: 'PURPLE',
                                title: "Giveaway's > Create giveaway",
                                // temps, salon, gain, nombre de gagnants
                                author: {
                                    name: `${message.author.tag}`,
                                    icon_url: `${message.author.avatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: `⏰ Time:`,
                                        value: `${giveaway[0] || 'No time'}`,
                                    },
                                    {
                                        name: `📨 Channel:`,
                                        value: `${giveaway[1] || 'No channel'}`,
                                    },
                                    {
                                        name: `👤 Winner:`,
                                        value: `${giveaway[2] || 'No winner'}`,
                                    },
                                    {
                                        name: `🎁 Price:`,
                                        value: `${giveaway[3] || 'No price'}`,
                                    },
                                ]
                            }],
                            components: [ row_1 ]
                        })
                        awaitButtons();
                        break;
                    }

                    case 'edit': {
                        awaitButtons();
                        break;
                    }

                    case 'cancel': {
                        awaitButtons();
                        break;
                    }

                    case 'list': {
                        awaitButtons();
                        break;
                    }


                        case 'time': {

                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            msg.edit({
                                content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                embeds: [{
                                    color: 'PURPLE',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `Waiting new time...`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'No channel'}`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `${giveaway[2] || 'No winner'}`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `${giveaway[3] || 'No price'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    
                                    let time = ms(collected.first().content)
                                    if(!Number(time) || isNaN(time)) return message.channel.send({ content: `:x: - ${message.author} temps invalide.`}).then(async (err) => {
                                        setTimeout(async () => {
                                            await err.delete();
                                        }, 5000)
                                    })
                                    giveaway[0] = `${time}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                    let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))
                                await msg.edit({
                                    content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                    embeds: [{
                                    color: 'PURPLE',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'No channel'}`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `${giveaway[2] || 'No winner'}`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `${giveaway[3] || 'No price'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'channel': {
                            
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            msg.edit({
                                content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `Waiting send channel...`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `${giveaway[2] || 'No winner'}`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `${giveaway[3] || 'No price'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                                    if(!channel) return message.channel.send({ content: `:x: - ${message.author} salon invalide.`}).then(async (err) => {
                                        setTimeout(async () => {
                                            await err.delete();
                                        }, 5000)
                                    })
                                    giveaway[1] = `${channel.id}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                await msg.edit({
                                    content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `${client.channels.cache.get(newGiveaway[1]) || 'No channel'}`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `${giveaway[2] || 'No winner'}`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `${giveaway[3] || 'No price'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'winners': {
                               
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            msg.edit({
                                content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'No channel'}`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `Waiting number of winner...`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `${giveaway[3] || 'No price'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    const winners = collected.first().content
                                    if(!Number(winners) && isNaN(winners)) return message.channel.send({ content: `:x: - ${message.author} nombre de gagnant invalide.`}).then(async (err) => {
                                        setTimeout(async () => {
                                            await err.delete();
                                        }, 5000)
                                    })
                                    giveaway[2] = `${winners}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                await msg.edit({
                                    content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `${client.channels.cache.get(newGiveaway[1]) || 'No channel'}`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `${newGiveaway[2] || 'No winner'}`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `${giveaway[3] || 'No price'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'price': {
    
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            msg.edit({
                                content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `${client.channels.cache.get(giveaway[1]) || 'No channel'}`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `${giveaway[2] || 'No winner'}`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `Waiting price...`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                            }).then(async (m) => {
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()

                                    const price = collected.first().content

                                    giveaway[3] = `${price}`
                                    db.set(`giveaways_settings_${client.user.id}`, giveaway)

                                    const newGiveaway = db.get(`giveaways_settings_${client.user.id}`)
                                await msg.edit({
                                    content: "↳ ⏰ - **Edit time**\n↳ 📨 - **Edit sending channel**\n↳ 👤 - **Edit number of winner**\n↳ 🎁 - **Edit price**",
                                embeds: [{
                                    color: '6b32a8',
                                    title: "Giveaway's > Create giveaway",
                                    // temps, salon, gain, nombre de gagnants
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                    fields: [
                                        {
                                            name: `⏰ Time:`,
                                            value: `${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)`,
                                        },
                                        {
                                            name: `📨 Channel:`,
                                            value: `${client.channels.cache.get(newGiveaway[1]) || 'No channel'}`,
                                        },
                                        {
                                            name: `👤 Winner:`,
                                            value: `${newGiveaway[2] || 'No winner'}`,
                                        },
                                        {
                                            name: `🎁 Price:`,
                                            value: `${newGiveaway[3] || 'No price'}`,
                                        },
                                    ]
                                }],
                                components: [ row_1 ]
                                })

                                })
                            })
                            awaitButtons();
                            break;
                        }

                        case 'send': {
                            
                            const button_4 = new MessageButton({
                                customId: "time",
                                label: "",
                                style: "SECONDARY",
                                emoji: "⏰",
                              })
                              const button_5 = new MessageButton({
                                customId: "channel",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📨",
                              })
                              const button_6 = new MessageButton({
                                customId: "winners",
                                label: "",
                                style: "SECONDARY",
                                emoji: "👤",
                              })
                              const button_7 = new MessageButton({
                                customId: "price",
                                label: "",
                                style: "SECONDARY",
                                emoji: "🎁",
                              })
                              const button_8 = new MessageButton({
                                customId: "send",
                                label: "",
                                style: "SUCCESS",
                                emoji: "✅",
                              })
                              const row_1 = new MessageActionRow({
                                components: [ button_4, button_5, button_6, button_7, button_8 ]
                            })

                            let newTime = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                            if(giveaway[0] == 'Aucun temps') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} settings \`Time\` invalid.`
                                })
                            } else if(giveaway[1] == 'Aucun salon') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} settings \`Channel\` invalid.`
                                })
                            } else if(giveaway[2] == 'Aucun gagnant') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} settings \`Winner\` invalid.`
                                })
                            } else if(giveaway[3] == 'Aucun gain') {
                                return message.channel.send({
                                    content: `:x: - ${message.author} settings \`Price\` invalid.`
                                })
                            } else {
                                const channel = client.channels.cache.get(giveaway[1])
                                channel.send({
                                    embeds: [{
                                        color: '6b32a8',
                                        title: `Giveaway's`,
                                        description: `🎁 | **__${giveaway[3]}__**\n↳ Launch by ${message.author}\n\n⏰ • **Time remaining:** \`${newTime.days} day(s), ${newTime.hours} hour(s), ${newTime.minutes} minute(s), ${newTime.seconds} second(s)\``
                                    }]
                                }).then(async (g) => {
                                    const emojis = '🎉'
                                    await g.react(emojis)

                                    var interval = setInterval(timer, 10000);
                                    async function timer() {
                                        let timeRemaining = ms2(giveaway[0] - (Date.now() - giveaway[4]))

                                        let emojisCount = g.reactions.cache.get(emojis).count;

                                        g.edit({
                                            embeds: [{
                                                color: '6b32a8',
                                                title: `Giveaway's`,
                                                description: `🎁 | **__${giveaway[3]}__**\n↳ Laucn by ${message.author} [\`${emojisCount}\` participant(s)]\n\n⏰ • **Time remaining:** \`${timeRemaining.days} day(s), ${timeRemaining.hours} hour(s), ${timeRemaining.minutes} minute(s), ${timeRemaining.seconds} second(s)\``
                                            }]
                                        })

                                        if(timeRemaining.seconds < 0) {
                                            console.log(g.reactions.cache.get(emojis))
                                            let win = []
                                            //let finalWin = 'x'

                                            const users = message.guild.members.cache
                                             const filter = (reaction, user) => {
                                                 return reaction.emoji.name === '🎉' && user.id === message.author.id;
                                             };
                                             const collector = g.createReactionCollector({ filter: filter, time: giveaway[0] });

                                             collector.on('collect', (reaction, user) => {
                                                 console.log(user.id + " react")
                                                 win.push(user.id)
                                             })

                                            const finalWin = message.guild.members.cache.get(win[Math.floor(win.length * Math.random())])

                                            g.edit({
                                                embeds: [{
                                                    color: '6b32a8',
                                                    title: `Giveaway's`,
                                                    description: `🎊 Giveaway ending 🎊\n↳ Laucn by ${message.author}\n\nGiveaway has win by ${finalWin}\n\n**${emojisCount}** participant(s)`
                                                }]
                                            })
                                            await message.channel.send({
                                                content: `:tada: • Good game ${finalWin}, you win **${giveaway[3]}** with giveaway of \`${message.author.tag}\`.\n\n» https://discord.com/channels/${g.guild.id}/${g.channel.id}/${g.id}`
                                            })
                                            await clearInterval(interval)
                                        }
                                    }
                                })
                            }

                            awaitButtons();
                            break;
                        }
                }
            }
        })

        /*switch(args[0]) {
            case 'cancel': {
                const msgId = args[1]
                    if(db.get(`client_${client.user.id}_giveaway_${msgId}`)) {
                        message.guild.channels.cache.forEach(async (c) => {
                            await c.fetchMessages(msgId)
                                .then(async (msg) => {
                                    console.log('message trouvé')
                                })
                                .catch((err) => {
                                    return;
                                })
                        })
                    } else {
                        message.channel.send({
                            content: `:x: - ${message.author} giveaway introuvable`
                        })
                    }
                break;
            }

            case 'edit': {

            }
        }*/
    }

    }
}