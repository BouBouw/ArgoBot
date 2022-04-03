const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "slot",
    aliases: ['slot-machine'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const array = [
        "🍀",
        "💎",
        "💰",
        "🪙"
    ];

    const final1 = array[Math.floor(array.length * Math.random())]
    const final2 = array[Math.floor(array.length * Math.random())]
    const final3 = array[Math.floor(array.length * Math.random())]
    const final4 = array[Math.floor(array.length * Math.random())]
    const final5 = array[Math.floor(array.length * Math.random())]
    const final6 = array[Math.floor(array.length * Math.random())]
    const final7 = array[Math.floor(array.length * Math.random())]
    const final8 = array[Math.floor(array.length * Math.random())]
    const final9 = array[Math.floor(array.length * Math.random())]

    switch(arr[0]) {
        case 'FR_fr': {
            const coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
            if(!coinsInPocket && coinsInPocket == 0) return message.channel.send({
                content: `:x: - ${message.author} vous n'avez pas d'argent (**en poche**) pour jouer au jeux.`
            })

            message.channel.send({
                content: `${message.author},\nLancement de la slot-machine...`,
                embeds: [{
                    color: `#f5f540`,
                    description: 
                    `
                    🟦 | ${final1} | ${final2} | ${final3} |
                    ▶️ | ${final4} | ${final5} | ${final6} |
                    🟦 | ${final7} | ${final8} | ${final9} |
                    `
                }]
            }).then(async (msg) => {
                if(final4 ===  '💰' && final5 ===  '💰' && final6 === '💰') {
                    msg.edit({
                        content: `${message.author}, \n💰 **JACKPOT** ! Vous venez de recevoir **500 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 500)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else if(final4 ===  '🍀' && final5 ===  '🍀' && final6 === '🍀') {
                    msg.edit({
                        content: `${message.author}, \n🍀 **CHANCEUX** ! Vous venez de recevoir **100 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 50)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else if(final4 ===  '💎' && final5 ===  '💎' && final6 === '💎') {
                    msg.edit({
                        content: `${message.author}, \n💎 **FANTASTIQUE** ! Vous venez de recevoir **150 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 150)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else if(final4 ===  '🪙' && final5 ===  '🪙' && final6 === '🪙') {
                    msg.edit({
                        content: `${message.author}, \n🪙 **RICHESSE** ! Vous venez de recevoir **50 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 50)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else {
                    msg.edit({
                        content: `${message.author}, \n**DOMMAGE** vous venez de perdre **15 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, 15)
                        
                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                }
            })
            break;
        }

        case 'EN_en': {
            const coinsInPocket = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
            if(!coinsInPocket && coinsInPocket == 0) return message.channel.send({
                content: `:x: - ${message.author} you don't have money (**in your pocket**) to play games.`
            })

            message.channel.send({
                content: `${message.author},\nLaunch of the slot machine...`,
                embeds: [{
                    color: `#f5f540`,
                    description: 
                    `
                    🟦 | ${final1} | ${final2} | ${final3} |
                    ▶️ | ${final4} | ${final5} | ${final6} |
                    🟦 | ${final7} | ${final8} | ${final9} |
                    `
                }]
            }).then(async (msg) => {
                if(final4 ===  '💰' && final5 ===  '💰' && final6 === '💰') {
                    msg.edit({
                        content: `${message.author}, \n💰 **JACKPOT**! You have just received **500 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 500)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else if(final4 ===  '🍀' && final5 ===  '🍀' && final6 === '🍀') {
                    msg.edit({
                        content: `${message.author}, \n🍀 **FORTUNATE** ! You have just received **100 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 50)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else if(final4 ===  '💎' && final5 ===  '💎' && final6 === '💎') {
                    msg.edit({
                        content: `${message.author}, \n💎 **FANTASTIC** ! You have just received **150 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 150)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else if(final4 ===  '🪙' && final5 ===  '🪙' && final6 === '🪙') {
                    msg.edit({
                        content: `${message.author}, \n🪙 **RICHNESS** ! You have just received **50 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, 50)

                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`
                        gameStats[1] = `${Math.round(Number(gameStats[1]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                } else {
                    msg.edit({
                        content: `${message.author}, \n**DAMAGE** you just lost **15 coins**`,
                        embeds: [{
                            color: `#f5f540`,
                            description: 
                            `
                            🟦 | ${final1} | ${final2} | ${final3} |
                            ▶️ | ${final4} | ${final5} | ${final6} |
                            🟦 | ${final7} | ${final8} | ${final9} |
                            `
                        }]
                    }).then(async () => {
                        await db.subtract(`guild_${message.guild.id}_users_${message.author.id}_coins`, 15)
                        
                        let gameStats = await db.get(`guild_${message.guild.id}_games_${message.author.id}`)
                        gameStats[0] = `${Math.round(Number(gameStats[0]) + 1)}`

                        await db.set(`guild_${message.guild.id}_games_${message.author.id}`, gameStats)
                    })
                }
            })
            break;
        }
    }

    }
}