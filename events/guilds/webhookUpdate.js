const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: 'webhookUpdate',
	once: true,
	execute: async (channel, client) => {
        const embed = new MessageEmbed()

        const arr = db.get(`global_settings_${client.user.id}`)

        const onwerlist = db.get(`client_${client.user.id}_ownerlist`)
        const whitelist = db.get(`client_${client.user.id}_whitelist`)

        const entry = await channel.guild.fetchAuditLogs({type: 'webhookUpdate'}).then(audit => audit.entries.first())

        if(arr[0] == 'FR_fr') {
            channel.fetchWebhooks().then(webhooks => {
                webhooks.forEach(async (wh) => {
                    if(db.get(`client_${client.user.id}_security_webhooks`) == 'enable') {
                        if(onwerlist.includes(entry.executor.id) && whitelist.includes(entry.executor.id)) {
                            embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true}))
                            embed.setDescription(`[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) vient de crée un webhook dans ${channel} (\`${channel.id}\`)\n\n**__Informations:__**\nNom > ${wh.name}\nID > ${wh.id}`)
                            embed.setTimestamp()
                            embed.setColor('RED')
                            const value = db.get(`client_${client.user.id}_logs`)
                            if(!value) {
                                return;
                            } else {
                                const logs = channel.guild.channels.cache.get(value[0])
                                if(logs) return logs.send({ embeds: [ embed ]})
                            }
                        } else {
                            embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true}))
                            embed.setDescription(`[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) vient de crée un webhook dans ${channel} (\`${channel.id}\`)\n\n**__Informations:__**\nNom > ${wh.name}\nID > ${wh.id}`)
                            embed.setTimestamp()
                            embed.setColor('RED')
                            const value = db.get(`client_${client.user.id}_logs`)
                            if(!value) {
                                await wh.delete()
                                    .catch((err) => console.log(err))
                            } else {
                                const logs = channel.guild.channels.cache.get(value[0])
                                if(logs) return logs.send({ embeds: [ embed ]})
                                await wh.delete()
                                    .catch((err) => console.log(err))
                            }
                        }
                    } else {
                        embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true}))
                        embed.setDescription(`[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) vient de crée un webhook dans ${channel} (\`${channel.id}\`)\n\n**__Informations:__**\nNom > ${wh.name}\nID > ${wh.id}`)
                        embed.setTimestamp()
                        embed.setColor('RED')
                        const value = db.get(`client_${client.user.id}_logs`)
                        if(!value) {
                            return;
                        } else {
                            const logs = channel.guild.channels.cache.get(value[0])
                            if(logs) return logs.send({ embeds: [ embed ]})
                        }
                    }
                })
            })
        } else {
            channel.fetchWebhooks().then(webhooks => {
                webhooks.forEach(async (wh) => {
                    if(db.get(`client_${client.user.id}_security_webhooks`) == 'enable') {
                        if(onwerlist.includes(entry.executor.id) && whitelist.includes(entry.executor.id)) {
                            embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true}))
                            embed.setDescription(`[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) just created a webhook in ${channel} (\`${channel.id}\`)\n\n**__Informations:__**\nName > ${wh.name}\nID > ${wh.id}`)
                            embed.setTimestamp()
                            embed.setColor('RED')
                            const value = db.get(`client_${client.user.id}_logs`)
                            if(!value) {
                                return;
                            } else {
                                const logs = channel.guild.channels.cache.get(value[0])
                                if(logs) return logs.send({ embeds: [ embed ]})
                            }
                        } else {
                            embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true}))
                            embed.setDescription(`[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) just created a webhook in ${channel} (\`${channel.id}\`)\n\n**__Informations:__**\nName > ${wh.name}\nID > ${wh.id}`)
                            embed.setTimestamp()
                            embed.setColor('RED')
                            const value = db.get(`client_${client.user.id}_logs`)
                            if(!value) {
                                await wh.delete()
                                    .catch((err) => console.log(err))
                            } else {
                                const logs = channel.guild.channels.cache.get(value[0])
                                if(logs) return logs.send({ embeds: [ embed ]})
                                await wh.delete()
                                    .catch((err) => console.log(err))
                            }
                        }
                    } else {
                        embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true}))
                        embed.setDescription(`[\`WEBHOOK\`] ${entry.executor} (\`${entry.executor.id}\`) just created a webhook in ${channel} (\`${channel.id}\`)\n\n**__Informations:__**\nName > ${wh.name}\nID > ${wh.id}`)
                        embed.setTimestamp()
                        embed.setColor('RED')
                        const value = db.get(`client_${client.user.id}_logs`)
                        if(!value) {
                            return;
                        } else {
                            const logs = channel.guild.channels.cache.get(value[0])
                            if(logs) return logs.send({ embeds: [ embed ]})
                        }
                    }
                })
            })
        }

        //  channel.fetchWebhooks().then(webhooks => {
        //    webhooks.forEach((wh => {
        //        if(db.get(`client_${client.user.id}_security_webhooks`) == 'enable') {
        //            embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
        //            embed.setDescription(`:bell: [\`WEBHOOK\`] ${entry.executor.tag} (\`${entry.executor.id}\`) vient de crée un webhook sous le nom de **${wh.name}**`)
        //            embed.setColor('ORANGE')
        //            embed.setTimestamp()
        //            embed.setFooter(client.user.username)
        //            if(db.get(`client_${channel.guild.id}_logs_raid`) !== null) return channel.guild.channels.cache.get(db.get(`client_${channel.guild.id}_logs_raid`)).send({ embeds: [embed] }).then(async (msg) => {
        //                wh.delete()
        //                .then(async => {
        //                    embed.addField(`:white_check_mark: - Suppression: Succès!`, `${channel} (\`${channel.id}\`)`)
        //                    msg.edit(embed)
        //                })
        //                .catch((err) => {
        //                    embed.addField(`:x: - Suppression: Echec!`, `${channel} (\`${channel.id}\`)`)
        //                    msg.edit(embed)
        //                })
        //            })
        //        } else {
        //            embed.setAuthor(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
        //            embed.setDescription(`:bell: [\`WEBHOOK\`] ${entry.executor.tag} (\`${entry.executor.id}\`) vient de crée un webhook sous le nom de **${wh.name}**`)
        //            embed.setColor('ORANGE')
        //            embed.setTimestamp()
        //            embed.setFooter(client.user.username)
        //            if(db.get(`client_${channel.guild.id}_logs_raid`) !== null) return channel.guild.channels.cache.get(db.get(`client_${channel.guild.id}_logs_raid`)).send({ embeds: [embed] })
        //        }
        //    }))
        //})
    }
}