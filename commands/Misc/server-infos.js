const fetch = require('node-fetch')
const moment = require('moment');
const db = require('quick.db');

module.exports = {
    name: "server-infos",
    aliases: ['server-info', 'si'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    switch(arr[0]) {
        case 'FR_fr': {
            const x = Date.now() - message.guild.createdTimestamp;
            const created = Math.floor(x / 86400000);

            let customLink = '';
            if(message.guild.vanityURLCode !== null && undefined) {
                customLink = `${message.guild.vanityURLCode}`
            } else {
                customLink = 'Aucun lien perso.'
            }

            let verified = '';
            if(message.guild.verified) {
                verified = '`✅`'
            } else {
                verified = "`❌`"
            }

            let partners = '';
            if(message.guild.partnered) {
                partners = '`✅`'
            } else {
                partners = "`❌`"
            }

            let guildDescription = '';
            if(!message.guild.description && message.guild.description == null) {
                guildDescription = 'Aucune description de serveur'
            } else {
                guildDescription = message.guild.description
            }

            await message.guild.fetchOwner().then(async (member) => {
                message.channel.send({
                    embeds: [{
                        color: `#326e2f`,
                        title: `Informations de ${message.guild.name}`,
                        description: `> Description: **${guildDescription}**`,
                        thumbnail: {
                            url: `${message.guild.iconURL({ dynamic: true })}`,
                        },
                        fields: [
                            {
                                name: `↬ Informations temporelle`,
                                value: `> Crée le ${moment(message.guild.createdAt).format('DD/MM/YYYY')} (Il y a **${created}** jours)`,
                            },
                            {
                                name: `↬ Informations serveur`,
                                value: `> Nom: **${message.guild.name}** \n> Identifiant: \`${message.guild.id}\`\n> Boosts: \`${message.guild.premiumSubscriptionCount}\`\n> Lien personnalisé: **${customLink}**`,
                            },
                            {
                                name: `↬ Informations publique`,
                                value: `> Vérifié: ${verified}\n> Partenaire: ${partners}`
                            },
                            {
                                name: `↬ Informations créateur`,
                                value: `> Nom d'utilisateur: **${member.user.username}** \n> Discriminateur: \`#${member.user.discriminator}\` \n> Identifiant: \`${member.user.id}\` \n> Surnom: ${member.user}`,
                            },
                            {
                                name: `↬ Informations membres`,
                                value: `> Membres: \`${message.guild.memberCount}\`\n> En ligne: \`${message.guild.members.cache.filter(m => m.presence?.status === 'online').size}\` | Inactif: \`${message.guild.members.cache.filter(m => m.presence?.status === 'idle').size}\` | Ne pas déranger: \`${message.guild.members.cache.filter(m => m.presence?.status === 'dnd').size}\` | Hors-ligne: \`${message.guild.members.cache.filter(m => m.presence?.status === 'offline').size}\``,
                            },
                            {
                                name: `↬ Informations rôles`,
                                value: `> Nombre de rôles: \`${message.guild.roles.cache.size}\`\n> Liste des rôles: ${message.guild.roles.cache.map(r => `<@&${r.id}>`).join(', ')}`
                            },
                            {
                                name: `↬ Informations salons`,
                                value: `> Nombre de salons: \`${message.guild.channels.cache.size}\`\n> Textuel: \`${Math.round(message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size)}\`\n> Vocaux: \`${Math.round(message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size + message.guild.channels.cache.filter(c => c.type === 'GUILD_STAGE_VOICE').size)}\``
                            },
                            {
                                name: `↬ Informations emojis`,
                                value: `> Nombre d'emojis: \`${message.guild.emojis.cache.size}\`\n> Liste des emojis: ${message.guild.emojis.cache.map(e => e).join(', ')}`
                            }
                        ]
                    }]
                })
            })
            break;
        }

        case 'EN_en': {
            const x = Date.now() - message.guild.createdTimestamp;
            const created = Math.floor(x / 86400000);

            let customLink = '';
            if(message.guild.vanityURLCode !== null && undefined) {
                customLink = `${message.guild.vanityURLCode}`
            } else {
                customLink = 'No custom link'
            }

            let verified = '';
            if(message.guild.verified) {
                verified = '`✅`'
            } else {
                verified = "`❌`"
            }

            let partners = '';
            if(message.guild.partnered) {
                partners = '`✅`'
            } else {
                partners = "`❌`"
            }

            let guildDescription = '';
            if(!message.guild.description && message.guild.description == null) {
                guildDescription = 'Any description for this guild'
            } else {
                guildDescription = message.guild.description
            }

            await message.guild.fetchOwner().then(async (member) => {
                message.channel.send({
                    embeds: [{
                        color: `#326e2f`,
                        title: `Information of ${message.guild.name}`,
                        description: `> Description: **${guildDescription}**`,
                        thumbnail: {
                            url: `${message.guild.iconURL({ dynamic: true })}`,
                        },
                        fields: [
                            {
                                name: `↬ Time information`,
                                value: `> Created at ${moment(message.guild.createdAt).format('DD/MM/YYYY')} (ago **${created}** days)`,
                            },
                            {
                                name: `↬ Guild information`,
                                value: `> Name: **${message.guild.name}** \n> Identifiant: \`${message.guild.id}\`\n> Boosts: \`${message.guild.premiumSubscriptionCount}\`\n> Custom link: **${customLink}**`,
                            },
                            {
                                name: `↬ Public information`,
                                value: `> Verified: ${verified}\n> Partners: ${partners}`
                            },
                            {
                                name: `↬ Owner information`,
                                value: `> Username: **${member.user.username}** \n> Discriminator: \`#${member.user.discriminator}\` \n> Identifiant: \`${member.user.id}\` \n> Nickname: ${member.user}`,
                            },
                            {
                                name: `↬ Members information`,
                                value: `> Members count: \`${message.guild.memberCount}\`\n> Online: \`${message.guild.members.cache.filter(m => m.presence?.status === 'online').size}\` | Idle: \`${message.guild.members.cache.filter(m => m.presence?.status === 'idle').size}\` | Do not Disturb: \`${message.guild.members.cache.filter(m => m.presence?.status === 'dnd').size}\` | Offline: \`${message.guild.members.cache.filter(m => m.presence?.status === 'offline').size}\``,
                            },
                            {
                                name: `↬ Roles information`,
                                value: `> Roles count: \`${message.guild.roles.cache.size}\`\n> Roles list: ${message.guild.roles.cache.map(r => `<@&${r.id}>`).join(', ')}`
                            },
                            {
                                name: `↬ Channels informations`,
                                value: `> Channels count: \`${message.guild.channels.cache.size}\`\n> Text: \`${Math.round(message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size)}\`\n> Voices: \`${Math.round(message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size + message.guild.channels.cache.filter(c => c.type === 'GUILD_STAGE_VOICE').size)}\``
                            },
                            {
                                name: `↬ Emojis information`,
                                value: `> Emojis count: \`${message.guild.emojis.cache.size}\`\n> Emojis list: ${message.guild.emojis.cache.map(e => e).join(', ')}`
                            }
                        ]
                    }]
                })
            })
            break;
        }
    }

    }
}