const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "manage-coins",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const menu = new MessageButton({
        customId: "add",
        label: "",
        style: "SECONDARY",
        emoji: "➕",
    })
    const menu_1 = new MessageButton({
        customId: "remove",
        label: "",
        style: "SECONDARY",
        emoji: "➖",
    })
    const menu_2 = new MessageButton({
        customId: "reset",
        label: "",
        style: "SECONDARY",
        emoji: "♻️",
    })
    const row = new MessageActionRow({
        components: [ menu, menu_1, menu_2 ]
    })

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.` })

        const member = message.mentions.members.first()
        if(!member) return message.channel.send({ content: `:x: - ${message.author} vous devez mentionner un membre.`})

        message.channel.send({
            embeds: [{
                color: '#f5f540',
                title: `Gestion des coins de ${member.user.tag}`,
                description: "`➕` **Ajouter des coins**\n`➖` **Retirer des coins**\n\n`♻️` **Réinitialiser les coins**",
                timestamp: new Date(),
                footer: {
                    text: `${client.user.username}`
                }
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
                    case 'add': {
                        let question = await message.channel.send({ content: `⏳ - ${message.author} veuillez fournir le nombre de coins à ajouter au solde.` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            const number = Number(collected.first().content)
                            if(number < 0 || isNaN(number)) return message.channel.send({ content: `:x: - ${message.author} le nombre fournis est invalide.`})

                            if(db.get(`guild_${message.guild.id}_users_${member.user.id}_coins`) == null) {
                                await db.set(`guild_${message.guild.id}_users_${member.user.id}_coins`, number)
                                return message.channel.send({ content: `✅ - ${message.author} vous venez d'ajouter **${number} coins** au solde de ${member.user.tag}` })
                            } else {
                                await db.add(`guild_${message.guild.id}_users_${member.user.id}_coins`, number)
                                return message.channel.send({ content: `✅ - ${message.author} vous venez d'ajouter **${number} coins** au solde de ${member.user.tag}` })
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'remove': {
                        let question = await message.channel.send({ content: `⏳ - ${message.author} veuillez fournir le nombre de coins à retirer du solde.` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            const number = Number(collected.first().content)
                            if(number < 0 || isNaN(number)) return message.channel.send({ content: `:x: - ${message.author} le nombre fournis est invalide.`})

                            if(db.get(`guild_${message.guild.id}_users_${member.user.id}_coins`) == null) {
                                return message.channel.send({ content: `:x: - ${message.author} le membre ${member.user.tag} n'as pas de solde.`})
                            } else {
                                if(number > db.get(`guild_${message.guild.id}_users_${member.user.id}_coins`)) {
                                    return message.channel.send({ content: `:x: - ${message.author} le membre ${member.user.tag} n'as pas les soldes suffisants.`})
                                } else {
                                    await db.substract(`guild_${message.guild.id}_users_${member.user.id}_coins`, number)
                                    return message.channel.send({ content: `✅ - ${message.author} vous venez de retirer **${number} coins** du solde de ${member.user.tag}`})
                                }
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'reset': {
                        await db.delete(`guild_${message.guild.id}_users_${member.user.id}_coins`)
                        await message.channel.send({ content: `✅ - ${message.author} vous venez de réinitaliser le solde de ${member.user.tag}.` })
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.` })

        const member = message.mentions.members.first()
        if(!member) return message.channel.send({ content: `:x: - ${message.author} please provide a member.`})

        message.channel.send({
            embeds: [{
                color: '#ebc334',
                title: `Manage coins of ${member.user.tag}`,
                description: "`➕` **Add coins**\n`➖` **Remove coins**\n\n`♻️` **Reset coins**",
                timestamp: new Date(),
                footer: {
                    text: `${client.user.username}`
                }
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
                    case 'add': {
                        let question = await message.channel.send({ content: `⏳ - ${message.author} please provide a number to add to the balance.` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            const number = Number(collected.first().content)
                            if(number < 0 || isNaN(number)) return message.channel.send({ content: `:x: - ${message.author} number is invalid.`})

                            if(db.get(`guild_${message.guild.id}_users_${member.user.id}_coins`) == null) {
                                await db.set(`guild_${message.guild.id}_users_${member.user.id}_coins`, number)
                                return message.channel.send({ content: `✅ - ${message.author} you just added **${number} coins** to the balance of ${member.user.tag}` })
                            } else {
                                await db.add(`guild_${message.guild.id}_users_${member.user.id}_coins`, number)
                                return message.channel.send({ content: `✅ - ${message.author} you just added **${number} coins** to the balance of ${member.user.tag}` })
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'remove': {
                        let question = await message.channel.send({ content: `⏳ - ${message.author} please provide a number to remove to the balance.` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()

                            const number = Number(collected.first().content)
                            if(number < 0 || isNaN(number)) return message.channel.send({ content: `:x: - ${message.author} number is invalid.`})

                            if(db.get(`guild_${message.guild.id}_users_${member.user.id}_coins`) == null) {
                                return message.channel.send({ content: `:x: - ${message.author} member ${member.user.tag} have no balance.`})
                            } else {
                                if(number > db.get(`guild_${message.guild.id}_users_${member.user.id}_coins`)) {
                                    return message.channel.send({ content: `:x: - ${message.author} member ${member.user.tag} do not have sufficient balances.`})
                                } else {
                                    await db.substract(`guild_${message.guild.id}_users_${member.user.id}_coins`, number)
                                    return message.channel.send({ content: `✅ - ${message.author} you just removed **${number} coins** to the balance of ${member.user.tag}`})
                                }
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'reset': {
                        await db.delete(`guild_${message.guild.id}_users_${member.user.id}_coins`)
                        await message.channel.send({ content: `✅ - ${message.author} you just reset the balance of ${member.user.tag}.` })
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    }

    }
}