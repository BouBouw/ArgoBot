const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "setup-leave",
    aliases: ['set-leave'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const settings = db.get(`leave_settings_${client.user.id}`) // partern: ['enable/disable', 'channelID', 'message exemple']

    if(!settings) {
        db.set(`leave_settings_${client.user.id}`, ['disable', 'x', 'x'])
    }

    const button = new MessageButton({
        customId: "click",
        label: "",
        style: "SECONDARY",
        emoji: "🔘",
      })
      const button_1 = new MessageButton({
        customId: "channel",
        label: "",
        style: "SECONDARY",
        emoji: "✏️",
      })
      const button_2 = new MessageButton({
        customId: "message",
        label: "",
        style: "SECONDARY",
        emoji: "📑",
      })
      const row = new MessageActionRow({
        components: [ button, button_1, button_2 ]
    })

    if(settings[0] == 'enable') {
        statut = '✅'
    } else {
        statut = '❌'
    }

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        message.channel.send({
            embeds: [{
                color: '#f71b2e',
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Activer/Désactiver le système de départ**\n\`✏️\` **Editer le salon de départ**\n\`📑\` **Editer le message de départ**`,
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
                        if(settings[0] == 'enable') {
                            settings[0] = 'disable'
                            settings[1] = 'x'
                            db.set(`leave_settings_${client.user.id}`, settings)

                            msg.edit({
                                embeds: [{
                                    color: '#f71b2e',
                                    title: `Statut: \`❌\``,
                                    description: `\`🔘\` **Activer le système de départ**\n\`✏️\` **Editer le salon de départ**\n\`📑\` **Editer le message de départ**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ],
                            })

                        } else {
                            settings[0] = 'enable'
                            db.set(`leave_settings_${client.user.id}`, settings)

                            msg.edit({
                                embeds: [{
                                    color: '#f71b2e',
                                    title: `Statut: \`✅\``,
                                    description: `\`🔘\` **Désactiver le système de départ**\n\`✏️\` **Editer le salon de départ**\n\`📑\` **Editer le message de départ**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ],
                            }).then(async () => {
                                await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez mentionner le salon de départ.` }).then(async (m) => {
                                    const filter = (m) => m.author.id ===  message.author.id;
                                    message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                        await m.delete();
                                        collected.first().delete();
    
                                        const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} salon invalide.`})
    
                                        settings[1] = `${channel.id}`
                                        db.set(`leave_settings_${client.user.id}`, settings)
    
                                        let question_2 = message.channel.send({
                                            content: `:hourglass_flowing_sand: - ${message.author} veuillez fournir le message de départ.\n\n :bulb: > **__Vous avez 3 minutes pour faire le message de départ.__**`,
                                            embeds: [{
                                                color: `#7aeb34`,
                                                title: `Variable d'arrivées`,
                                                fields: [
                                                    {
                                                        name: "Membre",
                                                        value: "Pseudonyme: `{username}` \nDiscriminateur: `{tag}` \nMention: `{user}` \nIdentifiant: `{id}`",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Serveur",
                                                        value: "Nom: `{guild}` \nIdentifiant: `{guildId}` \nNombre de membres: `{guildCount}`",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Informations",
                                                        value: "**__Membre__** \n\nDate de création: `{userCreate}` \nDate de rejoins: `{userJoin}`\n\n **__Inviteur__** \n\n Pseudonyme: `{inviterName}` \nDiscriminateur: `{inviterTag}` \nMention: `{inviter}` \nIdentifiant: `{inviterId}`"
                                                    }
                                                ]
                                            }]
                                        }).then(async (m_2) => {
                                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected_1) => {
                                                await m_2.delete();
                                                collected_1.first().delete();
        
                                                const welcomeMessage = collected_1.first().content;
        
                                                settings[2] = `${welcomeMessage}`
                                                db.set(`leave_settings_${client.user.id}`, settings)
                                            })  
                                        })
                                    })
                                })
                            })
                        }
                        awaitButtons();
                        break;
                    }

                    case 'channel': {
                        await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez mentionner le salon de départ.` }).then(async (m) => {
                            const filter = (m) => m.author.id ===  message.author.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                await m.delete()
                                collected.first().delete();

                                const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                                if(!channel) return message.channel.send({ content: `:x: - ${message.author} salon invalide.`})
    
                                settings[1] = `${channel.id}`
                                db.set(`leave_settings_${client.user.id}`, settings)
                            })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'message': {
                        message.channel.send({
                            content: `:hourglass_flowing_sand: - ${message.author} veuillez fournir le message de départ.\n\n :bulb: > **__Vous avez 3 minutes pour faire le message de départ.__**`,
                            embeds: [{
                                color: `#7aeb34`,
                                title: `Variable d'arrivées`,
                                fields: [
                                    {
                                        name: "Membre",
                                        value: "Pseudonyme: `{username}` \nDiscriminateur: `{tag}` \nMention: `{user}` \nIdentifiant: `{id}`",
                                        inline: true
                                    },
                                    {
                                        name: "Serveur",
                                        value: "Nom: `{guild}` \nIdentifiant: `{guildId}` \nNombre de membres: `{guildCount}`",
                                        inline: true
                                    },
                                    {
                                        name: "Informations",
                                        value: "**__Membre__** \n\nDate de création: `{userCreate}` \nDate de rejoins: `{userJoin}`\n\n **__Inviteur__** \n\n Pseudonyme: `{inviterName}` \nDiscriminateur: `{inviterTag}` \nMention: `{inviter}` \nIdentifiant: `{inviterId}`"
                                    }
                                ]
                            }]
                        }).then(async (m) => {
                            const filter = (m) => m.author.id ===  message.author.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                await m.delete();
                                collected.first().delete();

                                const welcomeMessage = collected.first().content;
        
                                settings[2] = `${welcomeMessage}`
                                db.set(`leave_settings_${client.user.id}`, settings)
                            })
                        })
                        awaitButtons();
                        break;
                    }

                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        message.channel.send({
            embeds: [{
                color: '#f71b2e',
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Enable/Disable the welcome system**\n\`✏️\` **Edit welcome channel**\n\`📑\` **Edit welcome message**\n\`📌\` **Edit welcome role**`,
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
                        if(settings[0] == 'enable') {
                            settings[0] = 'disable'
                            settings[1] = 'x'
                            db.set(`leave_settings_${client.user.id}`, settings)

                            msg.edit({
                                embeds: [{
                                    color: '#f71b2e',
                                    title: `Statut: \`❌\``,
                                    description: `\`🔘\` **Disable the leave system**\n\`✏️\` **Edit leave channel**\n\`📑\` **Edit leave message**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ],
                            })

                        } else {
                            settings[0] = 'enable'
                            db.set(`leave_settings_${client.user.id}`, settings)

                            msg.edit({
                                embeds: [{
                                    color: '#f71b2e',
                                    title: `Statut: \`✅\``,
                                    description: `\`🔘\` **Enable the leave system**\n\`✏️\` **Edit leave channel**\n\`📑\` **Edit leave message**`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    }, 
                                }],
                                components: [ row ],
                            }).then(async () => {
                                await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please mention the leave channel.` }).then(async (m) => {
                                    const filter = (m) => m.author.id ===  message.author.id;
                                    message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                        await m.delete();
                                        collected.first().delete();
    
                                        const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} invalid channel.`})
    
                                        settings[1] = `${channel.id}`
                                        db.set(`leave_settings_${client.user.id}`, settings)
    
                                        let question_2 = message.channel.send({
                                            content: `:hourglass_flowing_sand: - ${message.author} vplease provide the leave message.\n\n :bulb: > **__You have 3 minutes to make the levae message.__**`,
                                            embeds: [{
                                                color: `#7aeb34`,
                                                title: `Welcome variable`,
                                                fields: [
                                                    {
                                                        name: "Member",
                                                        value: "Pseudonyme: `{username}` \nDiscriminator: `{tag}` \nMention: `{user}` \nIdentifiant: `{id}`",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Server",
                                                        value: "Name: `{guild}` \nIdentifiant: `{guildId}` \nMember count: `{guildCount}`",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Informations",
                                                        value: "**__Member__** \n\nCreation date: `{userCreate}` \nJoined date: `{userJoin}`\n\n **__Inviter__** \n\n Pseudonyme: `{inviterName}` \nDiscriminator: `{inviterTag}` \nMention: `{inviter}` \nIdentifiant: `{inviterId}`"
                                                    }
                                                ]
                                            }]
                                        }).then(async (m_2) => {
                                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected_1) => {
                                                await m_2.delete();
                                                collected_1.first().delete();
        
                                                const welcomeMessage = collected_1.first().content;
        
                                                settings[2] = `${welcomeMessage}`
                                                db.set(`leave_settings_${client.user.id}`, settings)
                                            })  
                                        })
                                    })
                                })
                            })
                        }
                        awaitButtons();
                        break;
                    }

                    case 'channel': {
                        await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please mention the leave channel.` }).then(async (m) => {
                            const filter = (m) => m.author.id ===  message.author.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                await m.delete()
                                collected.first().delete();

                                const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                                if(!channel) return message.channel.send({ content: `:x: - ${message.author} invalid channel.`})
    
                                settings[1] = `${channel.id}`
                                db.set(`leave_settings_${client.user.id}`, settings)
                            })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'message': {
                        message.channel.send({
                            content: `:hourglass_flowing_sand: - ${message.author} vplease provide the leave message.\n\n :bulb: > **__You have 3 minutes to make the leave message.__**`,
                            embeds: [{
                                color: `#7aeb34`,
                                title: `Welcome variable`,
                                fields: [
                                    {
                                        name: "Member",
                                        value: "Pseudonyme: `{username}` \nDiscriminator: `{tag}` \nMention: `{user}` \nIdentifiant: `{id}`",
                                        inline: true
                                    },
                                    {
                                        name: "Server",
                                        value: "Name: `{guild}` \nIdentifiant: `{guildId}` \nMember count: `{guildCount}`",
                                        inline: true
                                    },
                                    {
                                        name: "Informations",
                                        value: "**__Member__** \n\nCreation date: `{userCreate}` \nJoined date: `{userJoin}`\n\n **__Inviter__** \n\n Pseudonyme: `{inviterName}` \nDiscriminator: `{inviterTag}` \nMention: `{inviter}` \nIdentifiant: `{inviterId}`"
                                    }
                                ]
                            }]
                        }).then(async (m) => {
                            const filter = (m) => m.author.id ===  message.author.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] }).then(async (collected) => {
                                await m.delete();
                                collected.first().delete();

                                const welcomeMessage = collected.first().content;
        
                                settings[2] = `${welcomeMessage}`
                                db.set(`leave_settings_${client.user.id}`, settings)
                            })
                        })
                        awaitButtons();
                        break;
                    }

                }
            }
        })
    }

    }
}