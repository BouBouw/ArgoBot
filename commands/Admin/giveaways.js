const prettyMilliseconds = require('pretty-ms');
const { Permissions } = require('discord.js')
const db = require("quick.db")
const ms = require('ms')

module.exports = {
    name: "giveaways",
    aliases: ['giveaway'],
    description: "",
execute: async (client, message, args) => {
    let win = []
    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        switch(args[0]) {
            case 'create': {
                let question = await message.channel.send({ content: `⏳ - ${message.author} veuillez fournir le gain du giveaway.` })
                const filter = (m) => m.author.id === message.author.id;
                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                    question.delete()

                    const price = collected.first().content
                    collected.first().delete()
                        .then(async () => {
                            let question = await message.channel.send({ content: `⏳ - ${message.author} veuillez fournir le temps du giveaway.` })
                            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                question.delete()

                                const time = ms(collected.first().content)
                                if(!Number(time) || isNaN(time)) return message.channel.send({ content: `:x: - ${message.author} temps invalide.`})
                                
                                collected.first().delete()
                                    .then(async () => {
                                        let question = await message.channel.send({ content: `⏳ - ${message.author} veuillez fournir le nombre de gagnant du giveaway.` })
                                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                            question.delete()

                                            const winners = collected.first().content
                                            if(!Number(winners)) return message.channel.send({ content: `:x: - ${message.author} nombre invalide.`})
                                            collected.first().delete()
                                                .then(async () => {
                                                    let question = await message.channel.send({ content: `⏳ - ${message.author} dans quel salon voulez-vous lancer le giveaway ?` })
                                                    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                                        question.delete()

                                                        const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                                                        if(!channel) return message.channel.send({ content: `:x: - ${message.author} le salon est invalide.`})

                                                        const giveaway = await channel.send({
                                                            embeds: [{
                                                                author: {
                                                                    name: `${message.author.tag}`,
                                                                    icon_url: `${message.author.avatarURL({ dynamic: true })}`,
                                                                },
                                                                title: `🎁 | ${price}`,
                                                                description: `> Lancé par ${message.author}\n**Nombre de gagnant:** ${winners}`,
                                                                color: 'PURPLE',
                                                                footer: {
                                                                    text: `⏰ • Temps restant: ${prettyMilliseconds(time)}`,
                                                                    icon_url: `${client.user.avatarURL()}`,
                                                                }
                                                            }]
                                                        }).then(async (m) => {
                                                            m.react('🎁')

                                                            const users = message.guild.members.cache
                                                            const filter = (reaction, user) => {
                                                                return reaction.emoji.name === '🎁' && user.id === message.author.id;
                                                            };
                                                            let reactTime = time + 3000
                                                            const collector = m.createReactionCollector({ filter, time: reactTime });

                                                            collector.on('collect', (reaction, user) => {
                                                                win.push(user.id)
                                                            })

                                                            await db.set(`client_${client.user.id}_giveaway_${m.id}`, [`${m.id}`, `${message.author}`, `${price}`, `${time}`, `${winners}`])
                                                            let newTime = time
                                                            message.channel.send({
                                                                content: `:tada: - ${message.author} vous venez de lancer un giveaway dans ${channel}.`
                                                            })
                                                            collected.first().delete()

                                                            var myVar;
                                                            myFunction()

                                                            function myFunction() {
                                                                myVar = setInterval(timer, 10000);
                                                            }

                                                            async function timer() {
                                                                const array = db.get(`client_${client.user.id}_giveaway_${m.id}`)

                                                                newTime = newTime - 10000

                                                                array[3] = `${newTime}`
                                                                await db.set(`client_${client.user.id}_giveaway_${m.id}`, array)

                                                                if(newTime <= 0) {
                                                                    const finalWin = message.guild.members.cache.get(win[Math.floor(win.length * Math.random())])

                                                                    clearInterval(myVar)
                                                                    setTimeout(async () => {

                                                                        await m.edit({
                                                                            embeds: [{
                                                                                author: {
                                                                                    name: `${message.author.tag}`,
                                                                                    icon_url: `${message.author.avatarURL({ dynamic: true })}`,
                                                                                },
                                                                                title: `🎁 | ${price}`,
                                                                                description: `Evènement terminé.\n\n> Gagnant: ${finalWin}`,
                                                                                color: 'PURPLE',
                                                                                footer: {
                                                                                    text: `Nombre de gagnant: ${winners}`,
                                                                                    icon_url: `${client.user.avatarURL()}`,
                                                                                }
                                                                            }]
                                                                        }).catch((err) => {
                                                                            return;
                                                                        })
                                                                        await m.channel.send({
                                                                            content: `:tada: - ${finalWin} bien joué tu as gagné le giveaway ci-dessus!`
                                                                        }).then(async (finish) => {

                                                                                finish.react('♻️')

                                                                                const filter = (reaction, user) => {
                                                                                    return reaction.emoji.name === '♻️' && user.id === message.author.id;
                                                                                };
                                                                                const collector = finish.createReactionCollector({ filter, time: 15000 });
                                                                                collector.on('collect', async (reaction, user) => {
                                                                                    const msgReroll = await finish.channel.send({
                                                                                        content: `\`♻️\` ${message.author} nouveau tirage au sort du gagnant en cours...`
                                                                                    }).then(async (msg) => {
                                                                                        setTimeout(async () => {
                                                                                            const newFinalWin = message.guild.members.cache.get(win[Math.floor(win.length * Math.random())])
                                                                                            finish.edit({
                                                                                                content: `:tada: - ${newFinalWin} bien joué tu as gagné le giveaway ci-dessus!`
                                                                                            })
                                                                                            await msgReroll.delete()
                                                                                        }, 5000)
                                                                                    })
                                                                                })
                                                                        await db.delete(`client_${client.user.id}_giveaway_${m.id}`)
                                                                        })
                                                                    }, 2000)
                                                                }

                                                                await m.edit({
                                                                    embeds: [{
                                                                        author: {
                                                                            name: `${message.author.tag}`,
                                                                            icon_url: `${message.author.avatarURL({ dynamic: true })}`,
                                                                        },
                                                                        title: `🎁 | ${price}`,
                                                                        description: `> Lancé par ${message.author}\n**Nombre de gagnant:** ${winners}`,
                                                                        color: 'PURPLE',
                                                                        footer: {
                                                                            text: `⏰ • Temps restant: ${prettyMilliseconds(newTime)}`,
                                                                            icon_url: `${client.user.avatarURL()}`,
                                                                        }
                                                                    }]
                                                                }).catch((err) => {
                                                                    return;
                                                                })
                                                            }
                                                        })
                                                    })
                                                })
                                        })
                                    })
                            })
                        })
                })
                break;
            }

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
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
    }

    }
}