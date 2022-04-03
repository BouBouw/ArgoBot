const { MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "balance",
    aliases: ['coins', 'bal'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const menu = new MessageButton({
        customId: "deposit",
        label: "",
        style: "SECONDARY",
        emoji: "➕",
    })
    const menu_1 = new MessageButton({
        customId: "withdraw",
        label: "",
        style: "SECONDARY",
        emoji: "➖",
    })
    const row = new MessageActionRow({
        components: [ menu, menu_1 ]
      })

    let pocketCoins = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
    let bankCoins = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)

    let coinsInPocket = 0;
    if(!pocketCoins && pocketCoins == null) {
        coinsInPocket = 0;
    } else {
        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
    }

    let coinsInBank = 0;
    if(!bankCoins && bankCoins == null) {
        coinsInBank = 0;
    } else {
        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
    }

    if(arr[0] === 'FR_fr') {
        return message.channel.send({
            content: `${message.author},`,
            embeds: [{
                color: '#ebc334',
                description: `\`➕\` Déposer de l'argent en banque.\n\`➖\` Retirer de l'argent en banque`,
                fields: [
                    {
                        name: `En poche`,
                        value: `> **${coinsInPocket}**`,
                        inline: true
                    },
                    {
                        name: `En banque`,
                        value: `> **${coinsInBank}**`,
                        inline: true
                    },    
                ]
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
                    case 'deposit': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez entrer le montant d'argent à déposer sur votre compte en banque.`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()

                            const count = Number(collected.first().content)

                            if(isNaN(count) || count < 0) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre valide.` })
                            if(count > coinsInPocket) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas les fonds suffisants.` })

                            if(!pocketCoins && pocketCoins == null) {
                                await db.set(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                return message.channel.send({ content: `✅ - ${message.author} vous venez de déposer **${count}** sur votre compte en banque.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Déposer de l'argent en banque.\n\`➖\` Retirer de l'argent en banque`,
                                            fields: [
                                                {
                                                    name: `En poche`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `En banque`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                },    
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            } else {
                                await db.add(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                return message.channel.send({ content: `✅ - ${message.author} vous venez de déposer **${count}** sur votre compte en banque.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Déposer de l'argent en banque.\n\`➖\` Retirer de l'argent en banque`,
                                            fields: [
                                                {
                                                    name: `En poche`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `En banque`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                },    
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'withdraw': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez entrer le montant d'argent à retirer de votre compte en banque.`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()

                            const count = Number(collected.first().content)

                            if(isNaN(count) || count < 0) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre valide.` })
                            if(count > coinsInBank) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas les fonds suffisants.` })

                            if(!bankCoins && bankCoins == null) {
                                await db.set(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                return message.channel.send({ content: `✅ - ${message.author} vous venez de retirer **${count}** de votre compte en banque.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Déposer de l'argent en banque.\n\`➖\` Retirer de l'argent en banque`,
                                            fields: [
                                                {
                                                    name: `En poche`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `En banque`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                },    
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            } else {
                                await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                return message.channel.send({ content: `✅ - ${message.author} vous venez de retirer **${count}** de votre compte en banque.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Déposer de l'argent en banque.\n\`➖\` Retirer de l'argent en banque`,
                                            fields: [
                                                {
                                                    name: `En poche`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `En banque`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                },    
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            }
                        })
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    } else {
        return message.channel.send({
            content: `${message.author},`,
            embeds: [{
                color: '#ebc334',
                description: `\`➕\` Desposit money in bank.\n\`➖\` Withdraw money in bank`,
                fields: [
                    {
                        name: `In pocket`,
                        value: `> **${coinsInPocket}**`,
                        inline: true
                    },
                    {
                        name: `In bank`,
                        value: `> **${coinsInBank}**`,
                        inline: true
                    }
                ]
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
                    case 'deposit': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please enter the amount of money to deposit in your bank account.`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()

                            const count = Number(collected.first().content)

                            if(isNaN(count) || count < 0) return message.channel.send({ content: `:x: - ${message.author} please provide a valid number.` })
                            if(count > coinsInPocket) return message.channel.send({ content: `:x: - ${message.author} you do not have sufficient funds.` })

                            if(!pocketCoins && pocketCoins == null) {
                                await db.set(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                return message.channel.send({ content: `✅ - ${message.author} you just deposited **${count}** in your bank account.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Desposit money in bank.\n\`➖\` Withdraw money in bank`,
                                            fields: [
                                                {
                                                    name: `In pocket`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `In bank`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                }
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            } else {
                                await db.add(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                return message.channel.send({ content: `✅ - ${message.author} you just deposited **${count}** in your bank account.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Desposit money in bank.\n\`➖\` Withdraw money in bank`,
                                            fields: [
                                                {
                                                    name: `In pocket`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `In bank`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                }
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'withdraw': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please enter the amount of money to be withdrawn from your bank account.`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()

                            const count = Number(collected.first().content)

                            if(isNaN(count) || count < 0) return message.channel.send({ content: `:x: - ${message.author} please provide a valid number.` })
                            if(count > coinsInBank) return message.channel.send({ content: `:x: - ${message.author} you do not have sufficient funds.` })

                            if(!bankCoins && bankCoins == null) {
                                await db.set(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                return message.channel.send({ content: `✅ - ${message.author} you just withdrawned **${count}** from your bank account.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Desposit money in bank.\n\`➖\` Withdraw money in bank`,
                                            fields: [
                                                {
                                                    name: `In pocket`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `In bank`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                }
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            } else {
                                await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, count)
                                await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_bank`, count)
                                return message.channel.send({ content: `✅ - ${message.author} you just withdrawned **${count}** from your bank account.` }).then(async () => {
                                    let coinsInPocket = 0;
                                    if(!pocketCoins && pocketCoins == null) {
                                        coinsInPocket = 0;
                                    } else {
                                        coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
                                    }
                                
                                    let coinsInBank = 0;
                                    if(!bankCoins && bankCoins == null) {
                                        coinsInBank = 0;
                                    } else {
                                        coinsInBank = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)
                                    }

                                    msg.edit({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: '#ebc334',
                                            description: `\`➕\` Desposit money in bank.\n\`➖\` Withdraw money in bank`,
                                            fields: [
                                                {
                                                    name: `In pocket`,
                                                    value: `> **${coinsInPocket}**`,
                                                    inline: true
                                                },
                                                {
                                                    name: `In bank`,
                                                    value: `> **${coinsInBank}**`,
                                                    inline: true
                                                }
                                            ]
                                        }],
                                        components: [ row ]
                                    })
                                })
                            }
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