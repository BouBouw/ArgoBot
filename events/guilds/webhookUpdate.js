const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: 'webhookUpdate',
	once: true,
	execute: async (channel, client) => {
        const embed = new MessageEmbed()

        const arr = db.get(`global_settings_${client.user.id}`)

        const array = db.get(`client_${client.user.id}_logs`)
        if(!array) return;
        const logs = client.channels.cache.get(array[0])

        const onwerlist = db.get(`client_${client.user.id}_ownerlist`)
        const whitelist = db.get(`client_${client.user.id}_whitelist`)

        const entry = await channel.guild.fetchAuditLogs({type: 'webhookUpdate'}).then(audit => audit.entries.first())

        await createWebhooks();

        async function createWebhooks() {
            if(!logs) return; 

            switch(arr[0]) {
                case 'FR_fr': {
                    switch(db.get(`client_${client.user.id}_security_webhooks`)) {
                        case 'enable': {
                            channel.fetchWebhooks().then(webhooks => {
                                webhooks.forEach(async (wh) => {
                                    if(onwerlist.includes(entry.executor.id) && whitelist.includes(entry.executor.id)) {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) vient de crée un webhook dans ${channel} (\`${channel.id}\`)`,
                                                author: {
                                                    name: `${entry.executor.tag}`,
                                                    icon_url: `${entry.executor.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Informations:`,
                                                        value: `Nom: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                    }
                                                ]
                                            }]
                                        })
                                    } else {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) vient de crée un webhook dans ${channel} (\`${channel.id}\`)`,
                                                author: {
                                                    name: `${entry.executor.tag}`,
                                                    icon_url: `${entry.executor.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Informations:`,
                                                        value: `Nom: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                    }
                                                ]
                                            }]
                                        }).then(async (msg) => {
                                            wh.delete()
                                                .then(async () => {
                                                    msg.edit({
                                                        embeds: [{
                                                            color: '#32a88b',
                                                            description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) vient de crée un webhook dans ${channel} (\`${channel.id}\`)`,
                                                            author: {
                                                                name: `${entry.executor.tag}`,
                                                                icon_url: `${entry.executor.avatarURL()}`,
                                                            },
                                                            fields: [
                                                                {
                                                                    name: `Informations:`,
                                                                    value: `Nom: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                                },
                                                                {
                                                                    name: `Sécurité`,
                                                                    value: "`✅` Le webhooks à correctement été supprimer"
                                                                }
                                                            ]
                                                        }]
                                                    })
                                                })
                                                .catch((err) => {
                                                    msg.edit({
                                                        embeds: [{
                                                            color: '#32a88b',
                                                            description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) vient de crée un webhook dans ${channel} (\`${channel.id}\`)`,
                                                            author: {
                                                                name: `${entry.executor.tag}`,
                                                                icon_url: `${entry.executor.avatarURL()}`,
                                                            },
                                                            fields: [
                                                                {
                                                                    name: `Informations:`,
                                                                    value: `Nom: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                                },
                                                                {
                                                                    name: `Sécurité`,
                                                                    value: "`❌` Le webhooks n'a pas été supprimer."
                                                                }
                                                            ]
                                                        }]
                                                    })
                                                })
                                        })
                                    }
                                })
                            })
                            break;
                        }
                    }
                    break;
                }

                case 'EN_en': {
                    switch(db.get(`client_${client.user.id}_security_webhooks`)) {
                        case 'enable': {
                            channel.fetchWebhooks().then(webhooks => {
                                webhooks.forEach(async (wh) => {
                                    if(onwerlist.includes(entry.executor.id) && whitelist.includes(entry.executor.id)) {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) just created a webhook in ${channel} (\`${channel.id}\`)`,
                                                author: {
                                                    name: `${oldMessage.author.tag}`,
                                                    icon_url: `${oldMessage.author.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Informations:`,
                                                        value: `Name: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                    }
                                                ]
                                            }]
                                        })
                                    } else {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) just created a webhook in ${channel} (\`${channel.id}\`)`,
                                                author: {
                                                    name: `${entry.executor.tag}`,
                                                    icon_url: `${entry.executor.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Informations:`,
                                                        value: `Nom: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                    }
                                                ]
                                            }]
                                        }).then(async (msg) => {
                                            wh.delete()
                                                .then(async () => {
                                                    msg.edit({
                                                        embeds: [{
                                                            color: '#32a88b',
                                                            description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) just created a webhook in ${channel} (\`${channel.id}\`)`,
                                                            author: {
                                                                name: `${oldMessage.author.tag}`,
                                                                icon_url: `${oldMessage.author.avatarURL()}`,
                                                            },
                                                            fields: [
                                                                {
                                                                    name: `Informations:`,
                                                                    value: `Name: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                                },
                                                                {
                                                                    name: `Sécurité`,
                                                                    value: "`✅` The webhooks has been successfully deleted."
                                                                }
                                                            ]
                                                        }]
                                                    })
                                                })
                                                .catch((err) => {
                                                    msg.edit({
                                                        embeds: [{
                                                            color: '#32a88b',
                                                            description: `[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) just created a webhook in ${channel} (\`${channel.id}\`)`,
                                                            author: {
                                                                name: `${oldMessage.author.tag}`,
                                                                icon_url: `${oldMessage.author.avatarURL()}`,
                                                            },
                                                            fields: [
                                                                {
                                                                    name: `Informations:`,
                                                                    value: `Name: **${wh.name}** \nIdentifiant: \`${wh.id}\``
                                                                },
                                                                {
                                                                    name: `Sécurité`,
                                                                    value: "`❌` The webhooks has not been deleted."
                                                                }
                                                            ]
                                                        }]
                                                    })
                                                })
                                        })
                                    }
                                })
                            })
                        }
                    }
                }
            }
        }
    }
}