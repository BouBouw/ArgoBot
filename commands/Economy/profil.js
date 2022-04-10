const { MessageAttachment, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const Canvas = require('canvas');
const db = require('quick.db');
const fetch = require('node-fetch')
const moment = require('moment');

module.exports = {
    name: "profil",
    aliases: ['profile'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const menu = new MessageButton({
        customId: "informations",
        label: "",
        style: "SECONDARY",
        emoji: "👤",
    })
    const menu_1 = new MessageButton({
        customId: "economy",
        label: "",
        style: "SECONDARY",
        emoji: "📊",
    })
    const row = new MessageActionRow({
      components: [ menu, menu_1 ]
    })

    if(arr[0] === 'FR_fr') {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let banner = '';
        if(!banner) {
            banner = 'https://miro.medium.com/max/1400/1*7P8znG0tW7qmpOpZmSxj7w.png'
        } else {
            banner = await member.user.fetch().then((user) => user.bannerURL({ format: 'png', dynamic: true, size: 2048 }));
        }

        setTimeout(async () => {
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            const background = await Canvas.loadImage(`${banner}`);

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            context.strokeRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.arc(125, 125, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            context.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'banner.png');

            let pocketCoins = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
            let bankCoins = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)

            let coinsInPocket = 0;
            if(!pocketCoins && pocketCoins == null) {
                coinsInPocket = 0;
            } else {
                coinsInPocket = Number(pocketCoins)
            }

            let coinsInBank = 0;
            if(!bankCoins && bankCoins == null) {
                coinsInBank = 0;
            } else {
                coinsInBank = Number(bankCoins)
            }

            let initialExp = 500;

            let expUser = db.get(`guild_${message.guild.id}_exp_${message.author.id}`)
            let rankUser = db.get(`guild_${message.guild.id}_rank_${message.author.id}`)

            let nextLevelExp = initialExp * (Math.pow(2, rankUser) - 1);

            const x = Date.now() - member.user.createdTimestamp;
            const created = Math.floor(x / 86400000);
            const memberJoinedAt = member.joinedTimestamp ? Date.now() - member.joinedTimestamp : Date.now();
            const memberjoined = Math.floor(memberJoinedAt / 86400000)

            let bot = '';
            if(member.user.bot) {
                bot = '✅'
            } else {
                bot = '❌'
            }

            const statuses = {
              online: 'En Ligne (`🟢`)',
              idle: 'Inactif (`🟠`)',
              dnd: ' Ne pas déranger (`🔴`)',
              offline: 'Hors Ligne/Invisible (`⚫`)',
            };

            const activities = [];
            let customStatus;
            for (const activity of member.presence.activities.values()) {
              switch (activity.type) {
                case 'PLAYING':
                  activities.push(`Joue à **${activity.name}**`);
                  break;
                case 'LISTENING':
                  if (member.user.bot) activities.push(`Ecoute **${activity.name}**`);
                  else activities.push(`Ecoute **${activity.details}** par **${activity.state}**`);
                  break;
                case 'WATCHING':
                  activities.push(`Regarde **${activity.name}**`);
                  break;
                case 'STREAMING':
                  activities.push(`Stream **${activity.name}**`);
                  break;
                case 'CUSTOM_STATUS':
                  customStatus = activity.state;
                  break;
              }
            }

            let activity = ``;
            if(activities.length > 0) {
                activity = `• ${activities.join('\n')}`
            } else {
                activity = 'Aucune activitée détectée'
            }

            let cState = ``;
            if(customStatus) {
                cState = `${customStatus}`
            } else {
                cState = 'Aucun status personnalisé'
            }

            var acknowledgements = '';
            if(member.user.id == message.guild.ownerId){
                acknowledgements = 'Créateur du serveur (`👑`)';
            } else {
                acknowledgements = 'Aucun'
            }

            let description = '';
            const array = [
                `Attention, le grand et unique **${member.user.username}** est dans la place !`,
                `Tout le monde peut applaudir **${member.user.username}** !`, 
                `**${member.user.username}** vient d'apparaître !`,
                `Le magnifique et majestueux **${member.user.username}**`,
                `Roi **${member.user.username}** exige le silence !`,
            ]
            description = `\`⭐\` - ${`${array[Math.floor(array.length * Math.random())]}`}`

            let gameStats = await db.get(`guild_${message.guild.id}_games_${member.user.id}`)
            if(!gameStats) {
                await db.set(`guild_${message.guild.id}_games_${member.user.id}`, ['0', '0', '0', '0'])
                // Pattern: ['total Games', 'Win Games', 'Games hours', 'Coins Win']
            }

            return message.channel.send({
                embeds: [{
                    color: "#ebc334",
                    title: `Profil de ${member.user.tag}`,
                    description: `${description}`,
                    thumbnail: {
                        url: `${member.user.displayAvatarURL({ dynamic: true })}`,
                    },
                    fields: [
                        {
                            name: `↬ Informations temporelle`,
                            value: `> Crée le ${moment(member.user.createdAt).format('DD/MM/YYYY')} (il y a **${created}** jours)\n> Rejoins le ${moment(member.joinedTimestamp).format('DD/MM/YYYY')} (il y a **${memberjoined}** jours)`,
                        },
                        {
                            name: `↬ Informations utilisateur`,
                            value: `> Nom d'utilisateur: **${member.user.username}**\n> Discriminateur: \`#${member.user.discriminator}\`\n> Identifiant: \`${member.user.id}\`\n> Surnom: ${member.user}\n\n> Robot: \`${bot}\``
                        },
                        {
                            name: `↬ Activité(s) utilisateur`,
                            value: `> Status: **${statuses[member.presence.status]}**\n> Divertissement: ${activity}\n> Status personnalisé: **${cState}**`
                        },
                        {
                            name: `↬ Informations serveur`,
                            value: `> Remerciements: **${acknowledgements}**\n> Rôle le plus élevé: ${member.roles.highest}`
                        }
                    ],
                    image: {
                        url: 'attachment://banner.png',
                    },
                }],
                files: [ attachment ],
                components: [ row ]
            }).then(async (msg) => {
                const filter = (interaction) => interaction.user.id === member.user.id && interaction.isButton();
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
                        case 'informations': {
                            msg.edit({
                                embeds: [{
                                    color: "#ebc334",
                                    title: `Profil de ${member.user.tag}`,
                                    description: `${description}`,
                                    thumbnail: {
                                        url: `${member.user.displayAvatarURL({ dynamic: true })}`,
                                    },
                                    fields: [
                                        {
                                            name: `↬ Informations temporelle`,
                                            value: `> Crée le ${moment(member.user.createdAt).format('DD/MM/YYYY')} (il y a **${created}** jours)\n> Rejoins le ${moment(member.joinedTimestamp).format('DD/MM/YYYY')} (il y a **${memberjoined}** jours)`,
                                        },
                                        {
                                            name: `↬ Informations utilisateur`,
                                            value: `> Nom d'utilisateur: **${member.user.username}**\n> Discriminateur: \`#${member.user.discriminator}\`\n> Identifiant: \`${member.user.id}\`\n> Surnom: ${member.user}\n\n> Robot: \`${bot}\``
                                        },
                                        {
                                            name: `↬ Activité(s) utilisateur`,
                                            value: `> Status: **${statuses[member.presence.status]}**\n> Divertissement: **${activity}**\n> Status personnalisé: **${cState}**`
                                        },
                                        {
                                            name: `↬ Informations serveur`,
                                            value: `> Remerciements: **${acknowledgements}**\n> Rôle le plus élevé: ${member.roles.highest}`
                                        }
                                    ],
                                    image: {
                                        url: 'attachment://banner.png',
                                    },
                                }],
                                files: [ attachment ],
                                components: [ row ]
                            })
                            awaitButtons();
                            break;
                        }

                        case 'economy': {
                            msg.edit({
                                embeds: [{
                                    color: "#ebc334",
                                    title: `Profil de ${member.user.tag}`,
                                    description: `${description}`,
                                    thumbnail: {
                                        url: `${member.user.displayAvatarURL({ dynamic: true })}`,
                                    },
                                    fields: [
                                        {
                                            name: `↬ Niveaux`,
                                            value: `> Rank: \`${rankUser}\`\n> Expériences: \`${expUser}\`\n\n> Prochain niveau: \`${Number(rankUser) + 1}\` (exp. **${Math.round(nextLevelExp - expUser)}**)`,
                                        },
                                        {
                                            name: `↬ Economie`,
                                            value: `> En poche: **${coinsInPocket}**\n> En banque: **${coinsInBank}**`,
                                        },
                                        {
                                            name: `↬ Jeux`,
                                            value: `> Parties jouées: ${Number(gameStats[0])} (\`${Number(gameStats[2])} temps\`)\n> Parties gagnées: ${Number(gameStats[1])}\n\n> Récompenses gagnées: ${Number(gameStats[3])}`
                                        }
                                    ],
                                    image: {
                                        url: 'attachment://banner.png',
                                    },
                                }],
                                files: [ attachment ],
                            })
                            awaitButtons();
                            break;
                        }
                    }
                }
            })
        }, 500)
    } else {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let banner = '';
        if(!banner) {
            banner = 'https://miro.medium.com/max/1400/1*7P8znG0tW7qmpOpZmSxj7w.png'
        } else {
            banner = await member.user.fetch().then((user) => user.bannerURL({ format: 'png', dynamic: true, size: 2048 }));
        }

        setTimeout(async () => {
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            const background = await Canvas.loadImage(`${banner}`);

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            context.strokeRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.arc(125, 125, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            context.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'banner.png');

            let pocketCoins = db.get(`guild_${message.guild.id}_users_${message.author.id}_coins`)
            let bankCoins = db.get(`guild_${message.guild.id}_users_${message.author.id}_bank`)

            let coinsInPocket = 0;
            if(!pocketCoins && pocketCoins == null) {
                coinsInPocket = 0;
            } else {
                coinsInPocket = Number(pocketCoins)
            }

            let coinsInBank = 0;
            if(!bankCoins && bankCoins == null) {
                coinsInBank = 0;
            } else {
                coinsInBank = Number(bankCoins)
            }

            let initialExp = 500;

            let expUser = db.get(`guild_${message.guild.id}_exp_${message.author.id}`)
            let rankUser = db.get(`guild_${message.guild.id}_rank_${message.author.id}`)

            let nextLevelExp = initialExp * (Math.pow(2, rankUser) - 1);

            const x = Date.now() - member.user.createdTimestamp;
            const created = Math.floor(x / 86400000);
            const memberJoinedAt = member.joinedTimestamp ? Date.now() - member.joinedTimestamp : Date.now();
            const memberjoined = Math.floor(memberJoinedAt / 86400000)

            let bot = '';
            if(member.user.bot) {
                bot = '✅'
            } else {
                bot = '❌'
            }

            const statuses = {
              online: 'Online (`🟢`)',
              idle: 'Idle (`🟠`)',
              dnd: 'Do not Disturb (`🔴`)',
              offline: 'Offline/Invisible (`⚫`)',
            };

            const activities = [];
            let customStatus;
            for (const activity of member.presence.activities.values()) {
              switch (activity.type) {
                case 'PLAYING':
                  activities.push(`Playing to **${activity.name}**`);
                  break;
                case 'LISTENING':
                  if (member.user.bot) activities.push(`Listening **${activity.name}**`);
                  else activities.push(`Listening **${activity.details}** by **${activity.state}**`);
                  break;
                case 'WATCHING':
                  activities.push(`Watching **${activity.name}**`);
                  break;
                case 'STREAMING':
                  activities.push(`Streaming **${activity.name}**`);
                  break;
                case 'CUSTOM_STATUS':
                  customStatus = activity.state;
                  break;
              }
            }

            let activity = ``;
            if(activities.length > 0) {
                activity = `• ${activities.join('\n')}`
            } else {
                activity = 'No activity detected'
            }

            let cState = ``;
            if(customStatus) {
                cState = `${customStatus}`
            } else {
                cState = 'No custom status'
            }

            var acknowledgements = '';
            if(member.user.id == message.guild.ownerId){
                acknowledgements = 'Guild owner (`👑`)';
            } else {
                acknowledgements = 'Nothing'
            }

            let description = '';
            const array = [
                `Attention, the great and unique **${member.user.username}** is in the place !`,
                `Anyone can clap **${member.user.username}** !`, 
                `**${member.user.username}** just appeared !`,
                `The beautiful and majestic **${member.user.username}**`,
                `King **${member.user.username}** demands silence!`,
            ]
            description = `\`⭐\` - ${`${array[Math.floor(array.length * Math.random())]}`}`

            let gameStats = await db.get(`guild_${message.guild.id}_games_${member.user.id}`)
            if(!gameStats) {
                await db.set(`guild_${message.guild.id}_games_${member.user.id}`, ['0', '0', '0', '0'])
                // Pattern: ['total Games', 'Win Games', 'Games hours', 'Coins Win']
            }

            return message.channel.send({
                embeds: [{
                    color: "#ebc334",
                    title: `Profile of ${member.user.tag}`,
                    description: `${description}`,
                    thumbnail: {
                        url: `${member.user.displayAvatarURL({ dynamic: true })}`,
                    },
                    fields: [
                        {
                            name: `↬ Time information`,
                            value: `> Created at ${moment(member.user.createdAt).format('DD/MM/YYYY')} (ago **${created}** days)\n> Joined at ${moment(member.joinedTimestamp).format('DD/MM/YYYY')} (ago **${memberjoined}** days)`,
                        },
                        {
                            name: `↬ User informations`,
                            value: `> Username: **${member.user.username}**\n> Discriminator: \`#${member.user.discriminator}\`\n> Identifiant: \`${member.user.id}\`\n> Nickname: ${member.user}\n\n> Bot: \`${bot}\``
                        },
                        {
                            name: `↬ User activities`,
                            value: `> Status: **${statuses[member.presence.status]}**\n> Entertainment: **${activity}**\n> Custom status: **${cState}**`
                        },
                        {
                            name: `↬ Guild information`,
                            value: `> Acknowledgements: **${acknowledgements}**\n> Highest role: ${member.roles.highest}`
                        }
                    ],
                    image: {
                        url: 'attachment://banner.png',
                    },
                }],
                files: [ attachment ],
                components: [ row ]
            }).then(async (msg) => {
                const filter = (interaction) => interaction.user.id === member.user.id && interaction.isButton();
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
                        case 'informations': {
                            msg.edit({
                                embeds: [{
                                    color: "#ebc334",
                                    title: `Profile of ${member.user.tag}`,
                                    description: `${description}`,
                                    thumbnail: {
                                        url: `${member.user.displayAvatarURL({ dynamic: true })}`,
                                    },
                                    fields: [
                                        {
                                            name: `↬ Time information`,
                                            value: `> Created at ${moment(member.user.createdAt).format('DD/MM/YYYY')} (ago **${created}** days)\n> Joined at ${moment(member.joinedTimestamp).format('DD/MM/YYYY')} (ago **${memberjoined}** days)`,
                                        },
                                        {
                                            name: `↬ User informations`,
                                            value: `> Username: **${member.user.username}**\n> Discriminator: \`#${member.user.discriminator}\`\n> Identifiant: \`${member.user.id}\`\n> Nickname: ${member.user}\n\n> Bot: \`${bot}\``
                                        },
                                        {
                                            name: `↬ User activities`,
                                            value: `> Status: **${statuses[member.presence.status]}**\n> Entertainment: **${activity}**\n> Custom status: **${cState}**`
                                        },
                                        {
                                            name: `↬ Guild information`,
                                            value: `> Acknowledgements: **${acknowledgements}**\n> Highest role: ${member.roles.highest}`
                                        }
                                    ],
                                    image: {
                                        url: 'attachment://banner.png',
                                    },
                                }],
                                files: [ attachment ],
                                components: [ row ]
                            })
                            awaitButtons();
                            break;
                        }

                        case 'economy': {
                            msg.edit({
                                embeds: [{
                                    color: "#ebc334",
                                    title: `Profil de ${member.user.tag}`,
                                    description: `${description}`,
                                    thumbnail: {
                                        url: `${member.user.displayAvatarURL({ dynamic: true })}`,
                                    },
                                    fields: [
                                        {
                                            name: `↬ Levels`,
                                            value: `> Rank: \`${rankUser}\`\n> Experiences: \`${expUser}\`\n\n> Next level: \`${Number(rankUser) + 1}\` (exp. **${Math.round(nextLevelExp - expUser)}**)`,
                                        },
                                        {
                                            name: `↬ Economy`,
                                            value: `> In pocket: **${coinsInPocket}**\n> In bank: **${coinsInBank}**`,
                                        },
                                        {
                                            name: `↬ Games`,
                                            value: `> Games played: ${Number(gameStats[0])} (\`${Number(gameStats[2])} times\`)\n> Games won: ${Number(gameStats[1])}\n\n> Awards earned: ${Number(gameStats[3])}`
                                        }
                                    ],
                                    image: {
                                        url: 'attachment://banner.png',
                                    },
                                }],
                                files: [ attachment ],
                            })
                            awaitButtons();
                            break;
                        }
                    }
                }
            })
        }, 500)
    }

    }
}