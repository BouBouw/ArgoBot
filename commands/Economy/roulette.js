const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "roulette",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const random = Math.floor(Math.random() * 100) + 1

    const menu = new MessageButton({
        customId: "red",
        label: "",
        style: "SECONDARY",
        emoji: "🔴",
      })
      const menu_1 = new MessageButton({
        customId: "black",
        label: "",
        style: "SECONDARY",
        emoji: "⚫",
      })
      const row = new MessageActionRow({
        components: [ menu, menu_1 ]
    })

    switch(arr[0]) {
        case 'FR_fr': {
            const coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
            if(!coinsInPocket && coinsInPocket == 0) return message.channel.send({
                content: `:x: - ${message.author} vous n'avez pas d'argent (**en poche**) pour jouer au jeux.`
            })
            
            message.channel.send({
                content: `${message.author},`,
                embeds: [{
                    color: `#f5f540`,
                    description: `Veuillez choisir entre **rouge** et **noir**`,
                    fileds: [
                        {
                            name: `\`🔴\` Rouge`,
                            value: `Nombre impair`,
                            inline: true
                        },
                        {
                            name: `\`⚫\` Noir`,
                            value: `Nombre pair`,
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

                    switch (collected.customId) {
                        case 'red': {
                            msg.edit({
                                embeds: [{
                                    color: `#f5f540`,
                                    description: `Vous avez choisit la couleur **rouge**`,
                                }],
                                components: [ ]
                            }).then(async () => {
                                setTimeout(async () => {
                                    if(random%2 == 0) { 
                                        // pair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**MALHEUREUSEMENT**, la couleur rouge n'est pas gagnante. Vous avez perdu **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    } else {
                                        // impair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**HEUREUSEMENT**, la couleur rouge est gagnante. Vous avez gagner **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    }
                                }, 5000)
                            })
                            break;
                        }

                        case 'black': {
                            msg.edit({
                                embeds: [{
                                    color: `#f5f540`,
                                    description: `Vous avez choisit la couleur **noir**`,
                                }],
                                components: [ ]
                            }).then(async () => {
                                setTimeout(async () => {
                                    if(random%2 == 0) { 
                                        // pair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**HEUREUSEMENT**, la couleur noir est gagnante. Vous avez gagner **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    } else {
                                        // impair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**MALHEUREUSEMENT**, la couleur noir n'est pas gagnante. Vous avez perdu **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    }
                                }, 5000)
                            })
                            break;
                        }
                    }
                }
            })
            break;
        }

        case 'EN_en': {
            const coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
            if(!coinsInPocket && coinsInPocket == 0) return message.channel.send({
                content: `:x: - ${message.author} you have no money (**in your pocket**) to play games.`
            })
            
            message.channel.send({
                content: `${message.author},`,
                embeds: [{
                    color: `#f5f540`,
                    description: `Please choose between **red** and **black**`,
                    fileds: [
                        {
                            name: `\`🔴\` Red`,
                            value: `Odd number`,
                            inline: true
                        },
                        {
                            name: `\`⚫\` Black`,
                            value: `Even number`,
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

                    switch (collected.customId) {
                        case 'red': {
                            msg.edit({
                                embeds: [{
                                    color: `#f5f540`,
                                    description: `You have chosen the color **red**`,
                                }],
                                components: [ ]
                            }).then(async () => {
                                setTimeout(async () => {
                                    if(random%2 == 0) { 
                                        // pair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**UNFORTUNATELY**, the color red is not a winner. You have lost **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    } else {
                                        // impair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**LUCKILY**, the color red is the winner. You have won **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    }
                                }, 5000)
                            })
                            break;
                        }

                        case 'black': {
                            msg.edit({
                                embeds: [{
                                    color: `#f5f540`,
                                    description: `You have chosen the color **black**`,
                                }],
                                components: [ ]
                            }).then(async () => {
                                setTimeout(async () => {
                                    if(random%2 == 0) { 
                                        // pair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**FORTUNATELY**, the color black is the winner. You have won **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    } else {
                                        // impair
                                        await msg.edit({
                                            embeds: [{
                                                color: `#f5f540`,
                                                description: `**UNFORTUNATELY**, the color black is not a winner. You have lost **10 coins**`,
                                            }],
                                            components: [ ]
                                        })
                                        db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, 10)

                                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`

                                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                                    }
                                }, 5000)
                            })
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