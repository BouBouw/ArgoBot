const fetch = require('node-fetch')
const moment = require('moment');
const db = require('quick.db');

module.exports = {
    name: "channel-infos",
    aliases: ['channel-info', 'ci'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

    switch(arr[0]) {
        case 'FR_fr': {
            const x = Date.now() - channel.createdTimestamp;
            const created = Math.floor(x / 86400000);

            message.channel.send({
                embeds: [{
                    color: `#326e2f`,
                    title: `Informations de ${channel.name}`,
                    description: `Topic:\n\`\`\`${channel.topic || 'Aucun'}\`\`\``,
                    fields: [
                        {
                            name: `↬ Informations temporelle`,
                            value: `Crée le ${moment(channel.createdAt).format('DD/MM/YYYY')} (Il y a **${created}** jours)`
                        },
                        {
                            name: `↬ Informations serveur`,
                            value: `> Mention: ${channel}\n> Nom: **${channel.name}**\n> Identifiant: \`${channel.id}\``
                        },
                        {
                            name: `↬ Informations salon`,
                            value: `> NSFW: ${channel.nsfw ? 'Oui' : 'Non'}`
                        }
                    ]
                }]
            })
            break;
        }

        case 'EN_en': {
            const x = Date.now() - channel.createdTimestamp;
            const created = Math.floor(x / 86400000);

            message.channel.send({
                embeds: [{
                    color: `#326e2f`,
                    title: `Information of ${channel.name}`,
                    description: `Topic:\n\`\`\`${channel.topic || ''}\`\`\``,
                    fields: [
                        {
                            name: `↬ Time information`,
                            value: `Created at ${moment(channel.createdAt).format('DD/MM/YYYY')} (Ago **${created}** days)`
                        },
                        {
                            name: `↬ Guild information`,
                            value: `> Mention: ${channel}\n> Name: **${channel.name}**\n> Identifiant: \`${channel.id}\``
                        },
                        {
                            name: `↬ Channel information`,
                            value: `> NSFW: ${channel.nsfw ? '**Yes**' : '**No**'}`
                        }
                    ]
                }]
            })
            break;
        }
    }

    }
}