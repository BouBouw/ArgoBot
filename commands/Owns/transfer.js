const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "transfer",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const bot_settings = db.get(`bot_settings_${client.user.id}`)

    const button = new MessageButton({
        customId: "yes",
        label: "",
        style: "SUCCESS",
        emoji: "✅",
      })
      const button_1 = new MessageButton({
        customId: "no",
        label: "",
        style: "DANGER",
        emoji: "❌",
      })
      const row = new MessageActionRow({
        components: [ button, button_1 ]
    })

    if(arr[0] == 'FR_fr') {
        if(message.author.id !== bot_settings[2]) return message.channel.send({ contentr: `:x: • ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        message.channel.send({
            content: `${message.author}, `,
            embeds: [{
                color: 'BLACK',
                title: `Transfer de ${client.user.tag}`,
                description: `Etes-vous sûr du transfert de serveur ?\n\n\`✅\` **Oui**\n\`❌\` **Non**`
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

            switch (collected.customId) {
                case 'yes': {
                    msg.edit({
                        embeds: [{
                            color: 'BLACK',
                            title: `Transfer de ${client.user.tag}`,
                            description: `En attente du nouvel identifiant de serveur.\n\n:bulb: • **${client.user.tag} doit être sur le nouveau serveur de transfert.**`
                        }]
                    })
                    const filter = (m) => m.author.id === message.author.id;
                    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                        collected.first().delete()

                        const guildId = collected.first().content

                        client.guilds.cache.forEach(async (guild) => {
                            if(guild.id === guildId) {
                                await message.channel.send({
                                    content: `✅ • ${message.author} désormais ${client.user.tag} est accessible que sur ${guild.name}.`
                                })
                                await msg.delete()
                                bot_settings[3] = `${guildId}`
                                db.set(`bot_settings_${client.user.id}`, bot_settings)
                            }
                        })
                    })
                    break;
                }

                case 'no': {
                    msg.edit({
                        embeds: [{
                            color: 'BLACK',
                            title: `Transfer de ${client.user.tag}`,
                            description: `Le transfert de serveur vient d'être annulé.\n\n:bulb: • **${client.user.tag} doit être sur le nouveau serveur de transfert.**`
                        }]
                    })
                    break;
                }
            }
            }
        })
    } else {
        if(message.author.id !== bot_settings[2]) return message.channel.send({ contentr: `:x: • ${message.author} you do not have permission to use this command.`})

        message.channel.send({
            content: `${message.author}, `,
            embeds: [{
                color: 'BLACK',
                title: `Transfer of ${client.user.tag}`,
                description: `Are you sure of the server transfer ?\n\n\`✅\` **Yes**\n\`❌\` **No**`
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

            switch (collected.customId) {
                case 'yes': {
                    msg.edit({
                        embeds: [{
                            color: 'BLACK',
                            title: `Transfer of ${client.user.tag}`,
                            description: `Waiting for new server ID.\n\n:bulb: • **${client.user.tag} must be on the new transfer server.**`
                        }]
                    })
                    const filter = (m) => m.author.id === message.author.id;
                    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                        collected.first().delete()

                        const guildId = collected.first().content

                        client.guilds.cache.forEach(async (guild) => {
                            if(guild.id === guildId) {
                                await message.channel.send({
                                    content: `✅ • ${message.author} already ${client.user.tag} is only accessible on ${guild.name}.`
                                })
                                await msg.delete()
                                bot_settings[3] = `${guildId}`
                                db.set(`bot_settings_${client.user.id}`, bot_settings)
                            }
                        })
                    })
                    break;
                }

                case 'no': {
                    msg.edit({
                        embeds: [{
                            color: 'BLACK',
                            title: `Transfer of ${client.user.tag}`,
                            description: `Server transfer has just been canceled.\n\n:bulb: • **${client.user.tag} must be on the new transfert server.**`
                        }]
                    })
                    break;
                }
            }
            }
        })
    }

    }
}