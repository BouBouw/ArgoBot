const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "settings",
    aliases: ['setting'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const ownerlist = db.get(`client_${client.user.id}_ownerlist`)
    const bot_settings = db.get(`bot_settings_${client.user.id}`)

    const act = db.get(`activity_${client.user.id}`)

    const embed = new MessageEmbed()

    const menu = new MessageButton({
        customId: "prefix",
        label: "",
        style: "SECONDARY",
        emoji: "🤖",
    })
    const menu_1 = new MessageButton({
        customId: "lang",
        label: "",
        style: "SECONDARY",
        emoji: "🏳️",
    })
    const menu_2 = new MessageButton({
        customId: "activity",
        label: "",
        style: "SECONDARY",
        emoji: "✏️",
    })
    const menu_3 = new MessageButton({
        customId: "visual",
        label: "",
        style: "SECONDARY",
        emoji: "👤",
    })
      const row = new MessageActionRow({
          components: [ menu, menu_1, menu_2, menu_3 ]
      })

    if(arr[0] === 'FR_fr') {
        if(message.author.id !== bot_settings[2] && !ownerlist.includes(message.author.id)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Paramètres`)
        embed.setDescription(`\`🤖\` **Modifier le préfix**\n\`🏳️\` **Modifier la langue**\n\n\`✏️\` **Modifier l'activité**\n\`👤\` **Modifier le visuel**`)
        embed.setTimestamp()
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
                    case 'prefix': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez définir le nouveau préfix.`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            const newPrefix = collected.first().content;
                            if(newPrefix.length > 3) return message.channel.send({ content: `[\`ERREUR\`] :x: - Votre préfix doit contenir au **maximum** 3 caractères.`})

                            arr[1] = `${newPrefix}`
                            db.set(`global_settings_${client.user.id}`, arr)
                            await message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de définir \`${newPrefix}\` comme nouveau préfix.` })
                        })
                        awaitButtons()
                        break;
                    }

                    case 'lang': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez définir la nouvelle langue du bot.\n(\`fr; en\`)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            collected.first().content;
                            switch(collected.first().content) {
                                case 'fr': {
                                    arr[0] = `FR_fr`
                                    db.set(`global_settings_${client.user.id}`, arr)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de définir la langue **française** à ${client.user}.` })
                                    break;
                                }

                                case 'en': {
                                    arr[0] = `EN_en`
                                    db.set(`global_settings_${client.user.id}`, arr)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} you have just set the **english** language to ${client.user}.` })
                                    break;
                                }
                            }
                            
                        })
                        awaitButtons()
                        break;
                    }

                    case 'activity': {
                        const game = new MessageButton({
                            customId: "game",
                            label: "",
                            style: "PRIMARY",
                            emoji: "🎲",
                        })
                        const status = new MessageButton({
                            customId: "status",
                            label: "",
                            style: "PRIMARY",
                            emoji: "💭",
                        })
                        const activity = new MessageActionRow({
                            components: [ game, status ]
                        })

                        embed.setDescription(`\`🎲\` **Activité**\n\`💭\` **Status**`)
                        msg.edit({
                            embeds: [ embed ],
                            components: [ activity ]
                        })
                        awaitButtons()
                        break;
                    }

                    case 'visual': {
                        const name = new MessageButton({
                            customId: "name",
                            label: "",
                            style: "PRIMARY",
                            emoji: "📌",
                        })
                        const avatar = new MessageButton({
                            customId: "avatar",
                            label: "",
                            style: "PRIMARY",
                            emoji: "🖼️",
                        })
                        const row_2 = new MessageActionRow({
                            components: [ name, avatar ]
                        })

                        embed.setDescription("`📌` **Modifier le nom**\n`🖼️` **Modifier l'avatar**")
                            msg.edit({
                                embeds: [ embed ],
                                components: [ row_2 ]
                            })
                            awaitButtons()
                            break;
                    }

                        case 'game': {
                            const button_1 = new MessageButton({
                                customId: "playing",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🎮",
                            })
                            const button_2 = new MessageButton({
                                customId: "listening",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🎶",
                            })
                            const button_3 = new MessageButton({
                                customId: "watching",
                                label: "",
                                style: "PRIMARY",
                                emoji: "💻",
                            })
                            const button_4 = new MessageButton({
                                customId: "streaming",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🟣",
                            })
                            const row_2 = new MessageActionRow({
                                components: [ button_1, button_2, button_3, button_4 ]
                            })

                            embed.setDescription("`🎮` **Joue à**\n`🎶` **Ecoute**\n`💻` **Regarde**\n`🟣` **Stream**")
                            msg.edit({
                                embeds: [ embed ],
                                components: [ row_2 ]
                            })
                            awaitButtons()
                            break;
                        }

                        case 'status': {
                            const invisible = new MessageButton({
                                customId: "invisible",
                                label: "",
                                style: "PRIMARY",
                                emoji: "⚫",
                            })
                            const dnd = new MessageButton({
                                customId: "dnd",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🔴",
                            })
                            const idle = new MessageButton({
                                customId: "idle",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🟠",
                            })
                            const online = new MessageButton({
                                customId: "online",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🟢",
                            })
                              const row_3 = new MessageActionRow({
                                  components: [ invisible, dnd, idle, online ]
                              })
                            embed.setDescription("`⚫` **Invisible**\n`🔴` **Ne pas déranger**\n`🟠` **Inactif**\n`🟢` **En ligne**")
                            msg.edit({
                                embeds: [ embed ],
                                components: [ row_3 ]
                            })
                            awaitButtons()
                            break;
                        }

                            case 'invisible': {
                                act[2] = 'invisible'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer le status de ${client.user} en **invisible**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'dnd': {
                                act[2] = 'dnd'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer le status de ${client.user} en **ne pas déranger**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'idle': {
                                act[2] = 'idle'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer le status de ${client.user} en **inactif**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'online': {
                                act[2] = 'online'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer le status de ${client.user} en **en ligne**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'playing': {
                                act[1] = 'PLAYING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel activité voulez-vous donner à ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} l'activité est trop grande [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer l'activité de ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'listening': {
                                act[1] = 'LISTENING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel activité voulez-vous donner à ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} l'activité est trop grande [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer l'activité de ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'watching': {
                                act[1] = 'WATCHING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel activité voulez-vous donner à ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} l'activité est trop grande [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer l'activité de ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'streaming': {
                                act[1] = 'STREAMING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel activité voulez-vous donner à ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} l'activité est trop grande [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer l'activité de ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'name': {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel nom voulez-vous donner à ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const name = collected.first().content;
                                    if(name.length > 16) return message.channel.send({ content: `:x: - ${message.author} le nom est trop grand [\`MAX: 16\`]`})

                                    client.user.setUsername(name)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer le nom de ${client.user}.\n> ${name}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'avatar': {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel avatar voulez-vous donner à ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const urlAvatar = collected.first().content;
                                    if(!urlAvatar.endsWith('.png') && !urlAvatar.endsWith('.jpg')) return message.channel.send({ content: `:x: - ${message.author} le format de l'avatar est invalide [\`PNG / JPG\`]`}) 

                                    client.user.setAvatar(urlAvatar)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de changer l'avatar de ${client.user}.`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }    
                }
            }
        })
    } else {
        if(message.author.id !== bot_settings[2] && !ownerlist.includes(message.author.id)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Paramètres`)
        embed.setDescription(`\`🤖\` **Edit prefix**\n\`🏳️\` **Edit langage**\n\n\`✏️\` **Edit activity**\n\`👤\` **Edit visual**`)
        embed.setTimestamp()
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
                    case 'prefix': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please set the new prefix.`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            const newPrefix = collected.first().content;
                            if(newPrefix.length > 3) return message.channel.send({ content: `[\`ERREUR\`] :x: - Your prefix must contain a maximum of **3 characters**.`})

                            arr[1] = `${newPrefix}`
                            db.set(`global_settings_${client.user.id}`, arr)
                            await message.channel.send({ content: `:white_check_mark: - ${message.author} you just defined \`${newPrefix}\` as new prefix.` })
                        })
                        awaitButtons()
                        break;
                    }

                    case 'lang': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please set the new bot language.\n(\`fr; en\`)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            collected.first().content;
                            switch(collected.first().content) {
                                case 'fr': {
                                    arr[0] = `FR_fr`
                                    db.set(`global_settings_${client.user.id}`, arr)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de définir la langue **française** à ${client.user}.` })
                                    break;
                                }

                                case 'en': {
                                    arr[0] = `EN_en`
                                    db.set(`global_settings_${client.user.id}`, arr)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} you have just set the **english** language to ${client.user}.` })
                                    break;
                                }
                            }
                            
                        })
                        awaitButtons()
                        break;
                    }

                    case 'activity': {
                        const game = new MessageButton({
                            customId: "game",
                            label: "",
                            style: "PRIMARY",
                            emoji: "🎲",
                        })
                        const status = new MessageButton({
                            customId: "status",
                            label: "",
                            style: "PRIMARY",
                            emoji: "💭",
                        })
                        const activity = new MessageActionRow({
                            components: [ game, status ]
                        })

                        embed.setDescription(`\`🎲\` **Activity**\n\`💭\` **Statut**`)
                        msg.edit({
                            embeds: [ embed ],
                            components: [ activity ]
                        })
                        awaitButtons()
                        break;
                    }

                    case 'visual': {
                        const name = new MessageButton({
                            customId: "name",
                            label: "",
                            style: "PRIMARY",
                            emoji: "📌",
                        })
                        const avatar = new MessageButton({
                            customId: "avatar",
                            label: "",
                            style: "PRIMARY",
                            emoji: "🖼️",
                        })
                        const row_2 = new MessageActionRow({
                            components: [ name, avatar ]
                        })

                        embed.setDescription("`📌` **Edit name**\n`🖼️` **Edit avatar**")
                            msg.edit({
                                embeds: [ embed ],
                                components: [ row_2 ]
                            })
                            awaitButtons()
                            break;
                    }

                        case 'game': {
                            const button_1 = new MessageButton({
                                customId: "playing",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🎮",
                            })
                            const button_2 = new MessageButton({
                                customId: "listening",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🎶",
                            })
                            const button_3 = new MessageButton({
                                customId: "watching",
                                label: "",
                                style: "PRIMARY",
                                emoji: "💻",
                            })
                            const button_4 = new MessageButton({
                                customId: "streaming",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🟣",
                            })
                            const row_2 = new MessageActionRow({
                                components: [ button_1, button_2, button_3, button_4 ]
                            })

                            embed.setDescription("`🎮` **Playing to**\n`🎶` **Listening**\n`💻` **Watching**\n`🟣` **Streaming**")
                            msg.edit({
                                embeds: [ embed ],
                                components: [ row_2 ]
                            })
                            awaitButtons()
                            break;
                        }

                        case 'status': {
                            const invisible = new MessageButton({
                                customId: "invisible",
                                label: "",
                                style: "PRIMARY",
                                emoji: "⚫",
                            })
                            const dnd = new MessageButton({
                                customId: "dnd",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🔴",
                            })
                            const idle = new MessageButton({
                                customId: "idle",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🟠",
                            })
                            const online = new MessageButton({
                                customId: "online",
                                label: "",
                                style: "PRIMARY",
                                emoji: "🟢",
                            })
                              const row_3 = new MessageActionRow({
                                  components: [ invisible, dnd, idle, online ]
                              })
                            embed.setDescription("`⚫` **Invisible**\n`🔴` **Do not disturb**\n`🟠` **Idle**\n`🟢` **Online**")
                            msg.edit({
                                embeds: [ embed ],
                                components: [ row_3 ]
                            })
                            awaitButtons()
                            break;
                        }

                            case 'invisible': {
                                act[2] = 'invisible'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} you have just changed the status of ${client.user} in **invisible**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'dnd': {
                                act[2] = 'dnd'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} you have just changed the status of ${client.user} in **do not disturb**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'idle': {
                                act[2] = 'idle'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} you have just changed the status of ${client.user} in **idle**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'online': {
                                act[2] = 'online'
                                db.set(`activity_${client.user.id}`, act)
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} you have just changed the status of ${client.user} in **online**`})
                                .then(async () => {
                                    await process.exit(0)
                                })
                            }

                            case 'playing': {
                                act[1] = 'PLAYING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what activity do you want to give to ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} the activity is too big [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} you just changed the activity of ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'listening': {
                                act[1] = 'LISTENING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what activity do you want to give to ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} the activity is too big [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} you just changed the activity of ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'watching': {
                                act[1] = 'WATCHING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what activity do you want to give to ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} the activity is too big [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} you just changed the activity of ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'streaming': {
                                act[1] = 'STREAMING'
                                db.set(`activity_${client.user.id}`, act)
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what activity do you want to give to ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const newActivity = collected.first().content;
                                    if(newActivity.length > 32) return message.channel.send({ content: `:x: - ${message.author} the activity is too big [\`MAX: 32\`]`})

                                    act[0] = `${newActivity}`
                                    db.set(`activity_${client.user.id}`, act)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} you just changed the activity of ${client.user}.\n> ${newActivity}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'name': {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what name do you want to give to ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const name = collected.first().content;
                                    if(name.length > 16) return message.channel.send({ content: `:x: - ${message.author} the name is too big [\`MAX: 16\`]`})

                                    client.user.setUsername(name)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} you just changed the name of ${client.user}.\n> ${name}`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }

                            case 'avatar': {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what avatar do you want to give to ${client.user}` })
                                const filter = (m) => m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                                    collected.first().delete()
                                    question.delete()

                                    const urlAvatar = collected.first().content;
                                    if(!urlAvatar.endsWith('.png') && !urlAvatar.endsWith('.jpg')) return message.channel.send({ content: `:x: - ${message.author} the avatar format is invalid [\`PNG / JPG\`]`}) 

                                    client.user.setAvatar(urlAvatar)
                                    return message.channel.send({ content: `:white_check_mark: - ${message.author} you just changed the avatar of ${client.user}.`}).then(async () => {
                                        await process.exit(0)
                                    })
                                })
                                break;
                            }    
                }
            }
        })
    }
    
    }
}