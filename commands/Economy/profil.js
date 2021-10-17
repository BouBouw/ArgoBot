const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

module.exports = {
    name: "profil",
    aliases: ['profile'],
    description: "",
execute: async (client, message, args) => {
    let page = 0;
    const arr = db.get(`global_settings_${client.user.id}`)

    const menu = new MessageButton({
        customId: "left",
        label: "",
        style: "PRIMARY",
        emoji: "⬅️",
    })
    const menu_1 = new MessageButton({
        customId: "right",
        label: "",
        style: "PRIMARY",
        emoji: "➡️",
    })
    const row = new MessageActionRow({
        components: [ menu, menu_1 ]
    })

    const embed = new MessageEmbed()
    if(arr[0] === 'FR_fr') {
        if(message.mentions.members.first()) {
            const member = message.mentions.members.first()

            embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            embed.setTitle('Informations')
            embed.setDescription(`Rejoins le: ${moment.utc(member.user.joinedAt).format('DD/MM/YYYY')}\nCrée le: ${moment.utc(member.user.createdAt).format('DD/MM/YYYY')}`)
            embed.setThumbnail(member.user.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            embed.setFooter(client.user.username)

            message.channel.send({
                content: `**Profil de ${member.user.tag} (\`${member.user.id}\`)**`,
                embeds: [ embed ],
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
                                page = 0;

                                var x = moment.utc(member.user.joinedAt)
                                var y = moment.utc(Date.now())
                                const date = moment.duration(y.diff(x))

                                embed.setTitle('Informations')
                                embed.setDescription(`Rejoins le: ${moment.utc(member.user.joinedAt).format('DD/MM/YYYY')}\nCrée le: ${moment.utc(member.user.createdAt).format('DD/MM/YYYY')}`)
                                await msg.edit({
                                    embeds: [ embed ]
                                })
                            }

                            if(page == 0) {
                                embed.setTitle('Informations')
                                embed.setDescription(`Rejoins le: ${moment.utc(member.user.joinedAt).format('DD/MM/YYYY')}\nCrée le: ${moment.utc(member.user.createdAt).format('DD/MM/YYYY')}`)
                                await msg.edit({
                                    embeds: [ embed ]
                                })
                            }

                            if(page == 1) {

                                var pocket = 0;
                                var bank = 0;

                                embed.setTitle('Coins')
                                embed.setDescription(`En poche: ${pocket}\nEn banque: ${bank}`)
                                await msg.edit({
                                    embeds: [ embed ]
                                })
                            }


                            awaitButtons()
                            break;
                        }

                        case 'right': {
                            page = page + 1;

                            if(page == 1) {

                                var pocket = 0;
                                var bank = 0;

                                embed.setTitle('Coins')
                                embed.setDescription(`En poche: ${pocket}\nEn banque: ${bank}`)
                                await msg.edit({
                                    embeds: [ embed ]
                                })
                            }

                            awaitButtons()
                            break;
                        }
                    }
                }
            })
        } else {
            const member = message.author

            if(args[0] == 'edit') {
                const menu_2 = new MessageButton({
                    customId: "edit",
                    label: "",
                    style: "PRIMARY",
                    emoji: "✏️",
                })
                const row_1 = new MessageActionRow({
                    components: [ menu_2 ]
                })

                embed.setTitle('Modification du profil')

                message.channel.send({
                    embeds: [ embed ],
                    components: [ row_1 ]
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
                            case 'edit': {
                                
                            }
                        }

                    }
                })
            } else {
                embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                embed.setTimestamp()
                embed.setFooter(client.user.username)

                message.channel.send({
                    content: `**Profil de ${member.user.tag} (\`${member.user.id}\`)**`,
                    embeds: [ embed ],
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

                            awaitButtons()
                            break;
                        }

                        case 'right': {
                            page = page + 1;

                            awaitButtons()
                            break;
                        }
                    }
                }
                })
            }
        }

    } else {

    }

    }
}