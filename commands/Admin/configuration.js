const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

module.exports = {
    name: "configuration",
    aliases: ['config'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const array = db.get(`client_${client.user.id}_security`)
    if(!array) return db.set(`client_${client.user.id}_security`, ['disable', 'disable', 'disable', 'disable', 'disable', 'disable', 'disable'])

    const menu = new MessageButton({
        customId: "left",
        label: "",
        style: "SECONDARY",
        emoji: "⬅️",
      })
      const menu_1 = new MessageButton({
        customId: "right",
        label: "",
        style: "SECONDARY",
        emoji: "➡️",
    })
    const row = new MessageActionRow({
        components: [ menu, menu_1 ]
    })

    let page = 0;
    
    let antiChannelState = '';
    if(array[0] == 'enable') { antiChannelState = '`✅`' } else { antiChannelState = '`❌`' }

    let antiRoleState = '';
    if(array[1] == 'enable') { antiRoleState = '`✅`' } else { antiRoleState = '`❌`' }

    let antiSpamState = '';
    if(array[2] == 'enable') { antiSpamState = '`✅`' } else { antiSpamState = '`❌`' }

    let antiLinkState = '';
    if(array[3] == 'enable') { antiLinkState = '`✅`' } else { antiLinkState = '`❌`' }

    let antiWebhookState = '';
    if(array[4] == 'enable') { antiWebhookState = '`✅`' } else { antiWebhookState = '`❌`' }

    let antiJoinState = '';
    if(array[5] == 'enable') { antiJoinState = '`✅`' } else { antiJoinState = '`❌`' }

    let antiBotState = '';
    if(array[6] == 'enable') { antiBotState = '`✅`' } else { antiBotState = '`❌`' }

    let antiUpdateState = '';
    if(array[7] == 'enable') { antiUpdateState = '`✅`' } else { antiUpdateState = '`❌`' }

    if(db.get(`client_${client.user.id}_coins`) == 'enable') { coins = '`✅`' } else { coins = '`❌`' }
    const normal = db.fetch(`client_${client.user.id}_coins_normal`) || 10; const stream = db.fetch(`client_${client.user.id}_coins_stream`) || 5; const mute = db.fetch(`client_${client.user.id}_coins_mute`) || 5;

    const welcomeSettings = db.get(`welcome_settings_${client.user.id}`)
    if(welcomeSettings[0] == 'enable') { welcomeStatus = '`✅`' } else { welcomeStatus = '`❌`' }
    const leaveSettings = db.get(`leave_settings_${client.user.id}`)
    if(leaveSettings[0] == 'enable') { leaveStatus = '`✅`' } else { leaveStatus = '`❌`' }

    const presenceSattings = db.get(`client_${client.user.id}_presence`)
    let presenceStatusState = '';
    if(presenceSattings[0] === 'enable' ) { presenceStatusState = '`✅`' } else { presenceStatusState = '`❌`' }
    const role = message.guild.roles.cache.get(presenceSattings[2]);
    if(!role) {
        rolePresence = 'Aucun'
    } else {
        rolePresence = `${role}`
    }

    switch(arr[0]) {
        case 'FR_fr': {
            const securityLevel = db.get(`client_${client.user.id}_securityLevel`)
            let securityLevelState = '';
            if(securityLevel == 1) { securityLevelState = 'Faible' } else if(securityLevel == 2) { securityLevelState = 'Moyenne' } else if(securityLevel == 3) { securityLevelState = 'Forte' } else { securityLevelState = 'Aucune' }

            message.channel.send({
                embeds: [{
                    color: '#f71b2e',
                    title: `Configuration > "Serveur"`,
                    description: `Niveau de sécurité: **${securityLevelState}**`,
                    fields: [
                        {
                            name: "Anti-Updates",
                            value: `${antiUpdateState}`
                        },
                        {
                            name: "Anti-Channels",
                            value : `${antiChannelState}`,
                        },
                        {
                            name: "Anti-Roles",
                            value : `${antiRoleState}`,
                        },
                        {
                            name: "Anti-Spam",
                            value : `${antiSpamState}`, 
                        },
                        {
                            name: "Anti-Links",
                            value : `${antiLinkState}`,
                        },
                        {
                            name: "Anti-Webhooks",
                            value : `${antiWebhookState}`,
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
                        case 'left': {
                            page = page - 1;

                            if(page < 0) {
                                page = 4;
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Départ"`,
                                        fields: [
                                            {
                                                name: `Système de départ`,
                                                value: `${leaveStatus}`
                                            },
                                            {
                                                name: `Salon des messages`,
                                                value: `${client.channels.cache.get(leaveSettings[1])}`
                                            },
                                            {
                                                name: `Message de départ`,
                                                value: `\`\`\`${leaveSettings[2]}\`\`\``
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 0) {
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Configuration > "Serveur"`,
                                        description: `Niveau de sécurité: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: "Anti-Updates",
                                                value: `${antiUpdateState}`
                                            },
                                            {
                                                name: "Anti-Channels",
                                                value : `${antiChannelState}`,
                                            },
                                            {
                                                name: "Anti-Roles",
                                                value : `${antiRoleState}`,
                                            },
                                            {
                                                name: "Anti-Spam",
                                                value : `${antiSpamState}`, 
                                            },
                                            {
                                                name: "Anti-Links",
                                                value : `${antiLinkState}`,
                                            },
                                            {
                                                name: "Anti-Webhooks",
                                                value : `${antiWebhookState}`,
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 1) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Utilisateurs"`,
                                        description: `Niveau de sécurité: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: `Anti-Bot`,
                                                value: `${antiBotState}`
                                            },
                                            {
                                                name: `Anti-Join`,
                                                value: `${antiJoinState}`
                                            },
                                            {
                                                name: `Presence Status`,
                                                value: `${presenceStatusState}\n> Texte: ${presenceSattings[1]}\n> Rôle: ${rolePresence}`
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 2) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Economie"`,
                                        fields: [
                                            {
                                                name: `Système d'économie`,
                                                value: `${coins}`
                                            },
                                            {
                                                name: `Normal`,
                                                value: `↳ ${normal}`,
                                                inline: true
                                            },
                                            {
                                                name: `Streaming`,
                                                value: `↳ ${stream}`,
                                                inline: true
                                            },
                                            {
                                                name: `Muets`,
                                                value: `↳ ${mute}`,
                                                inline: true
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 3) {
                                // https://stackoverflow.com/questions/11199565/replace-keys-in-string-by-value-based-on-key-value-entries-in-object
                                var arr = {
                                    "{username}" : `${message.author.username}`,
                                    "{tag}" : `${message.author.discriminator}`,
                                    "{user}" : `${message.author}`,
                                    "{id}" : `${message.author.id}`,
                                    "{guild}" : `${message.guild.name}`,
                                    "{guildId}" : `${message.guild.id}`,
                                    "{guildCount}" : `${message.guild.memberCount}`,
                                    "{userCreate}" : `${moment(message.author.createdAt).format('DD/MM/YYYY')}`,
                                    "{userJoin}" : `${moment(message.author.joinedTimestamp).format('DD/MM/YYYY')}`,
                                    "{inviterName}" : `${client.user.username}`,
                                    "{inviterTag}" : `${client.user.tag}`,
                                    "{inviter}" : `${client.user}`,
                                    "{inviterId}" : `${client.user.id}`,
                                    "{inviterCount}" : `${Math.floor(Math.random * 100) + 1}`,
                                }

                                var new_str = welcomeSettings[2];

                                for(var key in arr) {
                                    if (!arr.hasOwnProperty(key)) {
                                        continue;
                                }

                                new_str = new_str.replace(new RegExp(key, "g"), arr[key]);

                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Arrivés"`,
                                        fields: [
                                            {
                                                name: `Système d'arrivés`,
                                                value: `${welcomeStatus}`
                                            },
                                            {
                                                name: `Salon des messages`,
                                                value: `${client.channels.cache.get(welcomeSettings[1])}`
                                            },
                                            {
                                                name: `Message d'arrivé`,
                                                value: `\`\`\`${new_str}\`\`\``
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }
                            }

                            if(page == 4) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Départ"`,
                                        fields: [
                                            {
                                                name: `Système de départ`,
                                                value: `${leaveStatus}`
                                            },
                                            {
                                                name: `Salon des messages`,
                                                value: `${client.channels.cache.get(leaveSettings[1])}`
                                            },
                                            {
                                                name: `Message de départ`,
                                                value: `\`\`\`${leaveSettings[2]}\`\`\``
                                            },
                                        ],
                                        components: [ row ]
                                    }]
                                })
                            }

                            awaitButtons();
                            break;
                        }

                        case 'right': {
                            page = page + 1;

                            if(page > 5) {
                                page = 0;
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Configuration > "Serveur"`,
                                        description: `Niveau de sécurité: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: "Anti-Updates",
                                                value: `${antiUpdateState}`
                                            },
                                            {
                                                name: "Anti-Channels",
                                                value : `${antiChannelState}`,
                                            },
                                            {
                                                name: "Anti-Roles",
                                                value : `${antiRoleState}`,
                                            },
                                            {
                                                name: "Anti-Spam",
                                                value : `${antiSpamState}`, 
                                            },
                                            {
                                                name: "Anti-Links",
                                                value : `${antiLinkState}`,
                                            },
                                            {
                                                name: "Anti-Webhooks",
                                                value : `${antiWebhookState}`,
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 0) {
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Configuration > "Serveur"`,
                                        description: `Niveau de sécurité: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: "Anti-Updates",
                                                value: `${antiUpdateState}`
                                            },
                                            {
                                                name: "Anti-Channels",
                                                value : `${antiChannelState}`,
                                            },
                                            {
                                                name: "Anti-Roles",
                                                value : `${antiRoleState}`,
                                            },
                                            {
                                                name: "Anti-Spam",
                                                value : `${antiSpamState}`, 
                                            },
                                            {
                                                name: "Anti-Links",
                                                value : `${antiLinkState}`,
                                            },
                                            {
                                                name: "Anti-Webhooks",
                                                value : `${antiWebhookState}`,
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 1) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Utilisateurs"`,
                                        description: `Niveau de sécurité: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: `Anti-Bot`,
                                                value: `${antiBotState}`
                                            },
                                            {
                                                name: `Anti-Join`,
                                                value: `${antiJoinState}`
                                            },
                                            {
                                                name: `Presence Status`,
                                                value: `${presenceStatusState}\n> Texte: ${presenceSattings[1]}\n> Rôle: ${rolePresence}`
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 2) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Economie"`,
                                        fields: [
                                            {
                                                name: `Système d'économie`,
                                                value: `${coins}`
                                            },
                                            {
                                                name: `Normal`,
                                                value: `↳ ${normal}`,
                                                inline: true
                                            },
                                            {
                                                name: `Streaming`,
                                                value: `↳ ${stream}`,
                                                inline: true
                                            },
                                            {
                                                name: `Muets`,
                                                value: `↳ ${mute}`,
                                                inline: true
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 3) {
                                // https://stackoverflow.com/questions/11199565/replace-keys-in-string-by-value-based-on-key-value-entries-in-object
                                var arr = {
                                    "{username}" : `${message.author.username}`,
                                    "{tag}" : `${message.author.discriminator}`,
                                    "{user}" : `${message.author}`,
                                    "{id}" : `${message.author.id}`,
                                    "{guild}" : `${message.guild.name}`,
                                    "{guildId}" : `${message.guild.id}`,
                                    "{guildCount}" : `${message.guild.memberCount}`,
                                    "{userCreate}" : `${moment(message.author.createdAt).format('DD/MM/YYYY')}`,
                                    "{userJoin}" : `${moment(message.author.joinedTimestamp).format('DD/MM/YYYY')}`,
                                    "{inviterName}" : `${client.user.username}`,
                                    "{inviterTag}" : `${client.user.tag}`,
                                    "{inviter}" : `${client.user}`,
                                    "{inviterId}" : `${client.user.id}`,
                                    "{inviterCount}" : `${Math.floor(Math.random * 100) + 1}`,
                                }

                                var new_str = welcomeSettings[2];

                                for(var key in arr) {
                                    if (!arr.hasOwnProperty(key)) {
                                        continue;
                                }

                                new_str = new_str.replace(new RegExp(key, "g"), arr[key]);

                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Arrivés"`,
                                        fields: [
                                            {
                                                name: `Système d'arrivés`,
                                                value: `${welcomeStatus}`
                                            },
                                            {
                                                name: `Salon des messages`,
                                                value: `${client.channels.cache.get(welcomeSettings[1])}`
                                            },
                                            {
                                                name: `Message d'arrivé`,
                                                value: `\`\`\`${new_str}\`\`\``
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                                }
                            }

                            if(page == 4) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Départ"`,
                                        fields: [
                                            {
                                                name: `Système de départ`,
                                                value: `${leaveStatus}`
                                            },
                                            {
                                                name: `Salon des messages`,
                                                value: `${client.channels.cache.get(leaveSettings[1])}`
                                            },
                                            {
                                                name: `Message de départ`,
                                                value: `\`\`\`${leaveSettings[2]}\`\`\``
                                            },
                                        ],
                                        components: [ row ]
                                    }]
                                })
                            }

                            awaitButtons();
                            break;
                        }
                    }
                }
            })
            break;
        }

        case 'EN_en': {
            const securityLevel = await db.get(`client_${client.user.id}_securityLevel`)
            let securityLevelState = '';
            if(securityLevel = 1) { securityLevelState = 'Low' } else if(securityLevel = 2) { securityLevelState = 'Medium' } else if(securityLevel = 3) { securityLevelState = 'Strong' } else { securityLevelState = 'Any' }
            
            message.channel.send({
                embeds: [{
                    color: '#f71b2e',
                    title: `Configuration > "Server"`,
                    description: `Security level: **${securityLevelState}**`,
                    fields: [
                        {
                            name: "Anti-Updates",
                            value: `${antiUpdateState}`
                        },
                        {
                            name: "Anti-Channels",
                            value : `${antiChannelState}`,
                        },
                        {
                            name: "Anti-Roles",
                            value : `${antiRoleState}`,
                        },
                        {
                            name: "Anti-Spam",
                            value : `${antiSpamState}`, 
                        },
                        {
                            name: "Anti-Links",
                            value : `${antiLinkState}`,
                        },
                        {
                            name: "Anti-Webhooks",
                            value : `${antiWebhookState}`,
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
                        case 'left': {
                            page = page - 1;

                            if(page < 0) {
                                page = 4;
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Leave"`,
                                        fields: [
                                            {
                                                name: `Leave system`,
                                                value: `${leaveStatus}`
                                            },
                                            {
                                                name: `Message channel`,
                                                value: `${client.channels.cache.get(leaveSettings[1])}`
                                            },
                                            {
                                                name: `Leave message`,
                                                value: `\`\`\`${leaveSettings[2]}\`\`\``
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 0) {
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Configuration > "Server"`,
                                        description: `Security level: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: "Anti-Updates",
                                                value: `${antiUpdateState}`
                                            },
                                            {
                                                name: "Anti-Channels",
                                                value : `${antiChannelState}`,
                                            },
                                            {
                                                name: "Anti-Roles",
                                                value : `${antiRoleState}`,
                                            },
                                            {
                                                name: "Anti-Spam",
                                                value : `${antiSpamState}`, 
                                            },
                                            {
                                                name: "Anti-Links",
                                                value : `${antiLinkState}`,
                                            },
                                            {
                                                name: "Anti-Webhooks",
                                                value : `${antiWebhookState}`,
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 1) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Users"`,
                                        description: `Security level: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: `Anti-Bot`,
                                                value: `${antiBotState}`
                                            },
                                            {
                                                name: `Anti-Join`,
                                                value: `${antiJoinState}`
                                            },
                                            {
                                                name: `Presence Status`,
                                                value: `${presenceStatusState}\n> Text: ${presenceSattings[1]}\n> Role: ${rolePresence}`
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 2) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Economy"`,
                                        fields: [
                                            {
                                                name: `Economy system`,
                                                value: `${coins}`
                                            },
                                            {
                                                name: `Normal`,
                                                value: `↳ ${normal}`,
                                                inline: true
                                            },
                                            {
                                                name: `Streaming`,
                                                value: `↳ ${stream}`,
                                                inline: true
                                            },
                                            {
                                                name: `Muted`,
                                                value: `↳ ${mute}`,
                                                inline: true
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 3) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Welcome"`,
                                        fields: [
                                            {
                                                name: `Welcome system`,
                                                value: `${welcomeStatus}`
                                            },
                                            {
                                                name: `Message channel`,
                                                value: `${client.channels.cache.get(welcomeSettings[1])}`
                                            },
                                            {
                                                name: `Welcome message`,
                                                value: `\`\`\`${welcomeSettings[2]}\`\`\``
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 4) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Leave"`,
                                        fields: [
                                            {
                                                name: `Leave system`,
                                                value: `${leaveStatus}`
                                            },
                                            {
                                                name: `Message channel`,
                                                value: `${client.channels.cache.get(leaveSettings[1])}`
                                            },
                                            {
                                                name: `Leave message`,
                                                value: `\`\`\`${leaveSettings[2]}\`\`\``
                                            },
                                        ],
                                        components: [ row ]
                                    }]
                                })
                            }

                            awaitButtons();
                            break;
                        }

                        case 'right': {
                            page = page + 1;

                            if(page > 4) {
                                page = 0;
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Configuration > "Server"`,
                                        description: `Security level: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: "Anti-Updates",
                                                value: `${antiUpdateState}`
                                            },
                                            {
                                                name: "Anti-Channels",
                                                value : `${antiChannelState}`,
                                            },
                                            {
                                                name: "Anti-Roles",
                                                value : `${antiRoleState}`,
                                            },
                                            {
                                                name: "Anti-Spam",
                                                value : `${antiSpamState}`, 
                                            },
                                            {
                                                name: "Anti-Links",
                                                value : `${antiLinkState}`,
                                            },
                                            {
                                                name: "Anti-Webhooks",
                                                value : `${antiWebhookState}`,
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 0) {
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Configuration > "Server"`,
                                        description: `Security level: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: "Anti-Updates",
                                                value: `${antiUpdateState}`
                                            },
                                            {
                                                name: "Anti-Channels",
                                                value : `${antiChannelState}`,
                                            },
                                            {
                                                name: "Anti-Roles",
                                                value : `${antiRoleState}`,
                                            },
                                            {
                                                name: "Anti-Spam",
                                                value : `${antiSpamState}`, 
                                            },
                                            {
                                                name: "Anti-Links",
                                                value : `${antiLinkState}`,
                                            },
                                            {
                                                name: "Anti-Webhooks",
                                                value : `${antiWebhookState}`,
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 1) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Users"`,
                                        description: `Security level: **${securityLevelState}**`,
                                        fields: [
                                            {
                                                name: `Anti-Bot`,
                                                value: `${antiBotState}`
                                            },
                                            {
                                                name: `Anti-Join`,
                                                value: `${antiJoinState}`
                                            },
                                            {
                                                name: `Presence Status`,
                                                value: `${presenceStatusState}\n> Text: ${presenceSattings[1]}\n> Role: ${rolePresence}`
                                            }
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 2) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Economy"`,
                                        fields: [
                                            {
                                                name: `Economy system`,
                                                value: `${coins}`
                                            },
                                            {
                                                name: `Normal`,
                                                value: `↳ ${normal}`,
                                                inline: true
                                            },
                                            {
                                                name: `Streaming`,
                                                value: `↳ ${stream}`,
                                                inline: true
                                            },
                                            {
                                                name: `Muted`,
                                                value: `↳ ${mute}`,
                                                inline: true
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 3) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Welcome"`,
                                        fields: [
                                            {
                                                name: `Welcome system`,
                                                value: `${welcomeStatus}`
                                            },
                                            {
                                                name: `Message channel`,
                                                value: `${client.channels.cache.get(welcomeSettings[1])}`
                                            },
                                            {
                                                name: `Welcome message`,
                                                value: `\`\`\`${welcomeSettings[2]}\`\`\``
                                            },
                                        ]
                                    }],
                                    components: [ row ]
                                })
                            }

                            if(page == 4) {
                                msg.edit({
                                    embeds: [{
                                        color: `#f71b2e`,
                                        title: `Configuration > "Leave"`,
                                        fields: [
                                            {
                                                name: `Leave system`,
                                                value: `${leaveStatus}`
                                            },
                                            {
                                                name: `Message channel`,
                                                value: `${client.channels.cache.get(leaveSettings[1])}`
                                            },
                                            {
                                                name: `Leave message`,
                                                value: `\`\`\`${leaveSettings[2]}\`\`\``
                                            },
                                        ],
                                        components: [ row ]
                                    }]
                                })
                            }

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