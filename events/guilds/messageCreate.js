const { MessageActionRow, MessageButton, Permissions } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

module.exports = {
	name: 'messageCreate',
	once: false,
	execute: async (message, client) => {
        const arr = db.get(`global_settings_${client.user.id}`)
        const bot_settings = db.get(`bot_settings_${client.user.id}`)

        const ownerlist = db.get(`client_${client.user.id}_ownerlist`)
        const whitelist = db.get(`client_${client.user.id}_whitelist`)

        const array = db.get(`client_${client.user.id}_security`)
        // Pattern: ['anti-channels', 'anti-roles', 'anti-spam', 'anti-links', 'anti-webhooks', 'anti-joins', 'anti-bots', 'anti-update']


        const menu = new MessageButton({
            customId: "close",
            label: "",
            style: "DANGER",
            emoji: "⛔",
        })
        const menu_1 = new MessageButton({
            customId: "save",
            label: "",
            style: "SUCCESS",
            emoji: "📑"
        })
        const row = new MessageActionRow({
            components: [ menu, menu_1 ]
          })


        if(!message.guild) {
            await modmailSystem();
            async function modmailSystem() {
                const modmailSettings = await db.get(`client_${client.user.id}_modmails`)
                if(modmailSettings[0] == 'enable') {
                    if(message.author.bot) return;
                    const guild = client.guilds.cache.get(bot_settings[3])
                    const category = client.channels.cache.get(modmailSettings[1])
    
                    const ticketOpen = db.get(`modmail_${message.author.id}`)
                    let channel = await guild.channels.cache.find(channel => channel.topic === `Modmail: ${message.author.tag} [ ${message.author.id} ]`);
    
                    if(channel) {
                        if(message.author.bot) return;
                        switch(arr[0]) {
                            case 'FR_fr': {
                                await message.channel.send({
                                    content: `:x: - ${message.author} vous avez déjà un salon modmail d'ouvert.`,
                                })
                                break;
                            }
    
                            case 'EN_en': {
                                await message.channel.send({
                                    content: `:x: - ${message.author} you have already modmail channel open.`,
                                })
                                break;
                            }
                        }
                    } else {
                        const modmailRolesAccess = db.get(`roles_modmails_${client.user.id}`)

                        let rolesID = '';
                        if(!modmailRolesAccess) {
                            rolesID = '853261887520505866';
                        } else {
                            rolesID = modmailRolesAccess;
                        }

                        await guild.channels.create(`modmail-${message.author.username}`, {
                            type: 'GUILD_TEXT',
                            parent: category.id,
                            topic: `Modmail: ${message.author.tag} [ ${message.author.id} ]`,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone,
                                    deny: [ Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES ]
                                },
                                {
                                    id: message.author.id,
                                    allow: [ Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES ]
                                },
                                {
                                    id: rolesID,
                                    allow: [ Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES ]
                                }
                            ]
                        }).then(async (channel) => {
                            switch(arr[0]) {
                                case 'FR_fr': {
                                    channel.send({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: `#f52f6a`,
                                            description: `
                                            > Voici votre **ticket modmail**
                                            Une équipe de support vous prendras en charge dès que possible !
                                            :bulb: • Vous ne pouvez que créer 1 ticket modmail à la fois.
                                            `,
                                            author: {
                                                name: `${client.user.tag}`,
                                                icon_url: `${client.user.avatarURL()}`,
                                            }, 
                                        }],
                                        components: [ row ]
                                    }).then(async (msg) => {
                                        const actionUser = await guild.members.cache.map(m => {
                                            const filter = (interaction) => interaction.user.id === m.user.id && interaction.isButton();
                                            awaitButtons();
    
                                            let timeout = Number.MAX_SAFE_INTEGER + 1;
                                            
                                            guild.members.fetch({ cache: false })
    
                                            async function awaitButtons() {
                                                let collected;
                                                try {
                                                    collected = await msg.awaitMessageComponent({ filter: filter, time: 0 });
                                                } catch (err) {
                                                    if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                                                        return;
                                                    }
                                                }
                                    
                                                if (!collected.deffered) await collected.deferUpdate();
    
                                                switch(collected.customId) {
                                                    case 'close': {
                                                        const ch = db.get(`client_${client.user.id}_logs`)
                                                        const logs = guild.channels.cache.get(ch[1])
    
                                                        logs.send({
                                                            embeds: [{
                                                                color: `#32a88b`,
                                                                description: `[\`MODMAIL\`] ${collected.user} vient de fermer le ticket modmail de ${message.author} (\`${message.author.id}\`)`,
                                                                author: {
                                                                    name: `${message.author.tag}`,
                                                                    icon_url: `${message.author.avatarURL()}`,
                                                                },
                                                            }],
                                                        }).then(async () => {
                                                            channel.send({
                                                                content: `⏳ • Fermeture du salon dans **10 secondes**`
                                                            }).then(async () => {
                                                                setTimeout(async () => {
                                                                    await channel.delete()
                                                                }, 10000)
                                                            })
                                                        })
                                                        break;
                                                    }

                                                    case 'save': {
                                                        var hastebin = require('hastebin')

                                                        const channel = await client.channels.cache.get(collected.channel.id);
                                                        channel.messages.fetch().then(async (messages) => {
                                                            switch(arr[0]) {
                                                                case 'FR_fr': {
                                                                    channel.send({
                                                                        content: `⏳ • Sauvegarde de ${messages.size} message(s).`
                                                                    })
                                                                    break;
                                                                }

                                                                case 'EN_en': {
                                                                    channel.send({
                                                                        content: `⏳ • Save of ${messages.size} messages.`
                                                                    })
                                                                    break;
                                                                }
                                                            }
                                                            let finalArray = [];

                                                            const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a").replace("pm", "PM").replace("am", "AM");

                                                            messages.map(async (m) => {
                                                                await finalArray.push(`\n${handleTime(messages.createdTimestamp)} | ${m.author.username} : ${m.content}`)
                                                            })

                                                            hastebin.createPaste(`${finalArray.reverse()}`, {
                                                                raw: true,
                                                                contentType: 'text/plain',
                                                                server: 'https://hastebin.com'
                                                              }, {})
                                                                .then(function (urlToPaste) {
                                                                    channel.send({
                                                                        content: `> ${urlToPaste}`
                                                                    })
                                                                })
                                                                .catch(function (requestError) {
                                                                    switch(arr[0]) {
                                                                        case 'FR_fr': {
                                                                            channel.send({
                                                                                content: `❌ - ${message.author} une erreur est survenue lors de la sauvegarde.`
                                                                            })
                                                                            break;
                                                                        }

                                                                        case 'EN_en': {
                                                                            channel.send({
                                                                                content: `❌ - ${message.author} an error occurred while saving.`
                                                                            })
                                                                            break;
                                                                        }
                                                                    }
                                                                })
                                                        })
                                                        awaitButtons();
                                                        break;
                                                    }
                                                }
                                            }
                                        });
                                    })
    
                                    message.channel.send({
                                        content: `🔔 • Vous venez de recevoir une notification sur le serveur **${guild.name}**.`
                                    })
                                    break;
                                }
    
                                case 'EN_en': {
                                    channel.send({
                                        content: `${message.author},`,
                                        embeds: [{
                                            color: `#f52f6a`,
                                            description: `
                                            > Here is your **modmail ticket**
                                            A support team will take care of you as soon as possible!
                                            :bulb: • You can only create 1 modmail ticket at a time.
                                            `,
                                            author: {
                                                name: `${client.user.tag}`,
                                                icon_url: `${client.user.avatarURL()}`,
                                            }, 
                                        }],
                                        components: [ row ]
                                    }).then(async (msg) => {
                                        const filter = (interaction) => interaction.user.id === message.author.id && interaction.isButton();
                                        awaitButtons();

                                        let timeout = Number.MAX_SAFE_INTEGER + 1;
                                        
                                        async function awaitButtons() {
                                            let collected;
                                            try {
                                                collected = await msg.awaitMessageComponent({ filter: filter, time: 0 });
                                            } catch (err) {
                                                if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                                                    return msg.delete()
                                                }
                                            }
                                
                                            if (!collected.deffered) await collected.deferUpdate();

                                            switch(collected.customId) {
                                                case 'close': {
                                                    const ch = db.get(`client_${client.user.id}_logs`)
                                                    const logs = guild.channels.cache.get(ch[1])

                                                    logs.send({
                                                        embeds: [{
                                                            color: `#32a88b`,
                                                            description: `[\`MODMAIL\`] ${collected.user} just closed the modmail ticket from ${message.author} (\`${message.author.id}\`)`,
                                                            author: {
                                                                name: `${message.author.tag}`,
                                                                icon_url: `${message.author.avatarURL()}`,
                                                            },
                                                        }],
                                                    }).then(async () => {
                                                        channel.send({
                                                            content: `⏳ • Closing the channel in **10 seconds**`
                                                        }).then(async () => {
                                                            setTimeout(async () => {
                                                                await channel.delete()
                                                            }, 10000)
                                                        })
                                                    })
                                                    break;
                                                }

                                                case 'save': {
                                                    var hastebin = require('hastebin')

                                                        const channel = await client.channels.cache.get(collected.channel.id);
                                                        channel.messages.fetch().then(async (messages) => {
                                                            switch(arr[0]) {
                                                                case 'FR_fr': {
                                                                    channel.send({
                                                                        content: `⏳ • Sauvegarde de ${messages.size} message(s).`
                                                                    })
                                                                    break;
                                                                }

                                                                case 'EN_en': {
                                                                    channel.send({
                                                                        content: `⏳ • Save of ${messages.size} messages.`
                                                                    })
                                                                    break;
                                                                }
                                                            }
                                                            let finalArray = [];

                                                            const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a").replace("pm", "PM").replace("am", "AM");

                                                            messages.map(async (m) => {
                                                                await finalArray.push(`\n${handleTime(messages.createdTimestamp)} | ${m.author.username} : ${m.content}`)
                                                            })

                                                            hastebin.createPaste(`${finalArray.reverse()}`, {
                                                                raw: true,
                                                                contentType: 'text/plain',
                                                                server: 'https://hastebin.com'
                                                              }, {})
                                                                .then(function (urlToPaste) {
                                                                    channel.send({
                                                                        content: `> ${urlToPaste}`
                                                                    })
                                                                })
                                                                .catch(function (requestError) {
                                                                    switch(arr[0]) {
                                                                        case 'FR_fr': {
                                                                            channel.send({
                                                                                content: `❌ - ${message.author} une erreur est survenue lors de la sauvegarde.`
                                                                            })
                                                                            break;
                                                                        }

                                                                        case 'EN_en': {
                                                                            channel.send({
                                                                                content: `❌ - ${message.author} an error occurred while saving.`
                                                                            })
                                                                            break;
                                                                        }
                                                                    }
                                                                })
                                                        })
                                                    awaitButtons();
                                                    break;
                                                }
                                            }
                                        }
                                    })
    
                                    message.channel.send({
                                        content: `🔔 • You have just received a notification on the server **${guild.name}**.`
                                    })
                                    break;
                                }
                            }
                        })
                        await db.set(`modmail_${message.author.id}`, 1)
                    }
                }
            }
        } else {
            await linksDetect();
            await LevelAndExp();
            await antiSpamSystem();
        }

        async function linksDetect() {
            if(array[3] == 'enable') {
                if(message.author.id === client.user.id) return;

                var list = [
                    "https://discord.gg/",
                    "discord.gg/",
                    "http://",
                    "https://",
                ]

                if(message.content.includes(list)) {
                    if(!ownerlist.includes(message.author.id) && !whitelist.includes(message.author.id)) {
                        return;
                    } else {
                        await message.delete();
                    }
                }
            }
        }

        async function LevelAndExp() {
            let initialExp = 399;

            if(arr[0] === 'FR_fr') {
                if(message.author.bot) return;

                let expUser = db.get(`guild_${message.guild.id}_exp_${message.author.id}`)
                let rankUser = db.get(`guild_${message.guild.id}_rank_${message.author.id}`)
    
                if(expUser == null) {
                    await db.set(`guild_${message.guild.id}_exp_${message.author.id}`, 0)
                    await db.set(`guild_${message.guild.id}_rank_${message.author.id}`, 0)
                } else {
                    await db.add(`guild_${message.guild.id}_exp_${message.author.id}`, 1)

                    if(rankUser == 0) {
                        if(expUser == initialExp) {
                            await db.add(`guild_${message.guild.id}_rank_${message.author.id}`, 1)

                            let newRank = await db.get(`guild_${message.guild.id}_rank_${message.author.id}`)
                            return message.channel.send({ content: `:tada: - ${message.author}, tu viens d'atteindre le niveau \`${newRank}\` !` })
                        }
                    } else {
                        const nextLevelExp = initialExp * (Math.pow(2, rankUser) - 1);

                        if(nextLevelExp < expUser) {
                            await db.add(`guild_${message.guild.id}_rank_${message.author.id}`, 1)

                            let newRank = await db.get(`guild_${message.guild.id}_rank_${message.author.id}`)
                            return message.channel.send({ content: `:tada: - ${message.author}, tu viens d'atteindre le niveau \`${newRank}\` !` })
                        }
                    }
                }
            } else {
                if(message.author.bot) return;

                let expUser = db.get(`guild_${message.guild.id}_exp_${message.author.id}`)
                let rankUser = db.get(`guild_${message.guild.id}_rank_${message.author.id}`)
    
                if(expUser == null) {
                    await db.set(`guild_${message.guild.id}_exp_${message.author.id}`, 0)
                    await db.set(`guild_${message.guild.id}_rank_${message.author.id}`, 0)
                } else {
                    await db.add(`guild_${message.guild.id}_exp_${message.author.id}`, 1)

                    if(rankUser == 0) {
                        if(expUser == initialExp) {
                            await db.add(`guild_${message.guild.id}_rank_${message.author.id}`, 1)

                            let newRank = await db.get(`guild_${message.guild.id}_rank_${message.author.id}`)
                            return message.channel.send({ content: `:tada: - ${message.author}, you just up to level \`${newRank}\` !` })
                        }
                    } else {
                        const nextLevelExp = initialExp * (Math.pow(2, rankUser) - 1);

                        if(nextLevelExp < expUser) {
                            await db.add(`guild_${message.guild.id}_rank_${message.author.id}`, 1)

                            let newRank = await db.get(`guild_${message.guild.id}_rank_${message.author.id}`)
                            return message.channel.send({ content: `:tada: - ${message.author}, you just up to level \`${newRank}\` !` })
                        }
                    }
                }
            }
        }

        async function antiSpamSystem() {
            const mapping = new Map()

            let antispam = db.get(`client_${client.user.id}_security`)

            const blacklist = db.get(`client_${client.user.id}_blacklist`)
            const whitelist = db.get(`client_${client.user.id}_whitelist`)

            if(blacklist && whitelist) {
                if(blacklist.includes(message.author.id)) return;
                if(whitelist.includes(message.author.id)) return; 

                if(antispam[2] == 'enable') {
                    if(message.author.id === client.user.id) return;
                    if(message.author.id === message.guild.ownerId) return;

                    if(mapping.has(message.author.id)) {
                        const user = mapping.get(message.author.id)

                        let { msg } = user;
                        msg += 1;
                        user.msg = msg
                        mapping.set(message.author.id, user)

                        if(msg === 6) {
                            message.delete();
                            switch(arr[0]) {
                                case 'FR_fr': {
                                    message.channel.send({ content: `🚫 - ${message.author} vous envoyez des messages trop rapidement.` })
                                    break;
                                }

                                case 'EN_en': {
                                    message.channel.send({ content: `🚫 - ${message.author} you sending messages too fast.` })
                                    break;
                                }
                            }
                        } else if(msg === 10) {
                            message.guild.members.cache.get(message.author.id).kick()
                            switch(arr[0]) {
                                case 'FR_fr': {
                                    await message.guild.members.cache.get(message.author.id).kick()
                                    message.channel.send({ content: `[\`AUTO-MOD\`] ${message.author} (\`${message.author.id}\`) à été expulser du serveur pour **tentative de spam**.` })
                                    break;
                                }

                                case 'EN_en': {
                                    await message.guild.members.cache.get(message.author.id).kick()
                                    message.channel.send({ content: `[\`AUTO-MOD\`] ${message.author} (\`${message.author.id}\`) has kicked from the server for **attempt of spam**.` })
                                    break;
                                }
                            }
                        }
                    } else {
                        mapping.set(message.author.id, {
                            msg: 1
                        })
                        
                        setTimeout(() => {
                            mapping.delete(message.author.id)
                        }, 10000);
                    }
                }
            }
        }

    }
}