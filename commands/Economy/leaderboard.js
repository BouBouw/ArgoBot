const { MessageAttachment, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const db = require("quick.db");

module.exports = {
    name: "leaderboard",
    aliases: ['lb'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const menu = new MessageButton({
        customId: "coins",
        label: "",
        style: "SECONDARY",
        emoji: "🪙",
    })
    const menu_1 = new MessageButton({
        customId: "levels",
        label: "",
        style: "SECONDARY",
        emoji: "📊",
    })
    const row = new MessageActionRow({
      components: [ menu, menu_1 ]
    })
  

    switch(arr[0]) {
        case 'FR_fr': {
            message.channel.send({
                content: `${message.author},`,
                embeds: [{
                    color: `#f5f540`,
                    title: `Classements`,
                    fields: [
                        {
                            name: `↬ Classement de l'économie`,
                            value: `> Cliquez sur le bouton \`🪙\` pour voir la classement de l'économie du serveur.`
                        },
                        {
                            name: `↬ Classement de niveaux`,
                            value: `> Cliquez sur le bouton \`📊\` pour voir le classement de niveaux du serveur.`
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
                        case 'coins': {
                            const difarr = [];
                            message.guild.members.cache.forEach(user => {
                                difarr.push(user);
                            });

                            var allmemberlen = difarr.length
                            let people = 0;
                            let peopletoShow = 10;

                            let mes = [];

                            for(let i = 0; i < allmemberlen; i++){
                                var amount = db.fetch(`guild_${message.guild.id}_users_${difarr[i].id}_coins`)
                    
                                if(amount == null) continue;
                    
                                mes.push({
                                    name: difarr[i].id,
                                    amount: amount
                                })
                            }

                            const realArr = []
                            mes.sort((a, b) => b.amount - a.amount)
                            for(let k = 0; k < mes.length; k++){
                                people++
                                if(people >= peopletoShow) continue;
                                realArr.push(`•» ${message.guild.members.cache.get(mes[k].name)}\n En poche: **${mes[k].amount}**\nEn banque: **${db.fetch(`guild_${message.guild.id}_users_${mes[k].name}_bank`)}**`)
                            }
                        
                            var finalLeaderboardCoins = realArr.join("\n")

                            msg.edit({
                                content: `${message.author},`,
                                embeds: [{
                                    color: `#f5f540`,
                                    title: `Classements de l'économie`,
                                    description: `${finalLeaderboardCoins}`
                                }],
                                components: [ row ]
                            })
                            awaitButtons();
                            break;
                        }

                        case 'levels': {
                            const difarr = [];
                            message.guild.members.cache.forEach(user => {
                                difarr.push(user);
                            });

                            var allmemberlen = difarr.length
                            let people = 0;
                            let peopletoShow = 10;

                            let mes = [];

                            for(let i = 0; i < allmemberlen; i++){
                                var amount = db.fetch(`guild_${message.guild.id}_rank_${difarr[i].id}`)
                    
                                if(amount == null) continue;
                    
                                mes.push({
                                    name: difarr[i].id,
                                    amount: amount
                                })
                            }

                            const realArr = []
                            mes.sort((a, b) => b.amount - a.amount)
                            for(let k = 0; k < mes.length; k++){
                                people++
                                if(people >= peopletoShow) continue;
                                realArr.push(`•» ${message.guild.members.cache.get(mes[k].name)}\n Niveaux: **${mes[k].amount}**\nExpériences: **${db.fetch(`guild_${message.guild.id}_exp_${mes[k].name}`)}**`)
                            }

                            var finalLeaderboardLevels = realArr.join("\n")

                            msg.edit({
                                content: `${message.author},`,
                                embeds: [{
                                    color: `#f5f540`,
                                    title: `Classements de niveaux`,
                                    description: `${finalLeaderboardLevels}`
                                }],
                                components: [ row ]
                            })
                            awaitButtons();
                            break;
                        }
                    }
                }
            })
            break;
        }

        case 'EN_en': {
            message.channel.send({
                content: `${message.author},`,
                embeds: [{
                    color: `#f5f540`,
                    title: `Leaderboard`,
                    fields: [
                        {
                            name: `↬ Economy leaderboard`,
                            value: `> Click the \`🪙\` button to see the server economy leaderboard.`
                        },
                        {
                            name: `↬ Levels leaderboard`,
                            value: `> Click the \`📊\` button to see the server levels leaderboard.`
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
                        case 'coins': {
                            const difarr = [];
                            message.guild.members.cache.forEach(user => {
                                difarr.push(user);
                            });

                            var allmemberlen = difarr.length
                            let people = 0;
                            let peopletoShow = 10;

                            let mes = [];

                            for(let i = 0; i < allmemberlen; i++){
                                var amount = db.fetch(`guild_${message.guild.id}_users_${difarr[i].id}_coins`)
                    
                                if(amount == null) continue;
                    
                                mes.push({
                                    name: difarr[i].id,
                                    amount: amount
                                })
                            }

                            const realArr = []
                            mes.sort((a, b) => b.amount - a.amount)
                            for(let k = 0; k < mes.length; k++){
                                people++
                                if(people >= peopletoShow) continue;
                                realArr.push(`•» ${message.guild.members.cache.get(mes[k].name)}\n In pocket: **${mes[k].amount}**\nIn bank: **${db.fetch(`guild_${message.guild.id}_users_${mes[k].name}_bank`)}**`)
                            }
                        
                            var finalLeaderboardCoins = realArr.join("\n")

                            msg.edit({
                                content: `${message.author},`,
                                embeds: [{
                                    color: `#f5f540`,
                                    title: `Economy leaderboard`,
                                    description: `${finalLeaderboardCoins}`
                                }],
                                components: [ row ]
                            })
                            awaitButtons();
                            break;
                        }

                        case 'levels': {
                            const difarr = [];
                            message.guild.members.cache.forEach(user => {
                                difarr.push(user);
                            });

                            var allmemberlen = difarr.length
                            let people = 0;
                            let peopletoShow = 10;

                            let mes = [];

                            for(let i = 0; i < allmemberlen; i++){
                                var amount = db.fetch(`guild_${message.guild.id}_rank_${difarr[i].id}`)
                    
                                if(amount == null) continue;
                    
                                mes.push({
                                    name: difarr[i].id,
                                    amount: amount
                                })
                            }

                            const realArr = []
                            mes.sort((a, b) => b.amount - a.amount)
                            for(let k = 0; k < mes.length; k++){
                                people++
                                if(people >= peopletoShow) continue;
                                realArr.push(`•» ${message.guild.members.cache.get(mes[k].name)}\n Ranks: **${mes[k].amount}**\nExperiences: **${db.fetch(`guild_${message.guild.id}_exp_${mes[k].name}`)}**`)
                            }

                            var finalLeaderboardLevels = realArr.join("\n")

                            msg.edit({
                                content: `${message.author},`,
                                embeds: [{
                                    color: `#f5f540`,
                                    title: `Levels leaderboard`,
                                    description: `${finalLeaderboardLevels}`
                                }],
                                components: [ row ]
                            })
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