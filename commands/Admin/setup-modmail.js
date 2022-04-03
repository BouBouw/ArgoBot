const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "setup-modmail",
    aliases: ['setup-modmails'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const array = db.get(`client_${client.user.id}_modmails`)
    if(!array) { await db.set(`client_${client.user.id}_modmails`, ['disable', 'x']) }
    // Pattern: ['state', 'categoryID']

    const menu = new MessageButton({
        customId: "click",
        label: "",
        style: "SECONDARY",
        emoji: "🔘",
    })
    const menu_1 = new MessageButton({
        customId: "roles",
        label: "",
        style: "SECONDARY",
        emoji: "📌",
    })
    const row = new MessageActionRow({
        components: [ menu, menu_1]
      })

    if(arr[0] == 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        let statut = '';
        if(array[0] == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }

        await message.channel.send({
            embeds: [{
                color: '#f71b2e',
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Activer/Désactiver les modmails**`,
                author: {
                    name: `${message.author.tag}`,
                    icon_url: `${message.author.avatarURL()}`,
                }, 
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
                    case 'click': {
                        if(!array) {
                            await db.set(`client_${client.user.id}_modmails`, ['disable', 'x'])
                        } else {
                            if(array[0] == 'enable') {
                                array[0] = 'disbale'
                                await db.set(`client_${client.user.id}_modmails`, array)
    
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`❌\``,
                                        description: `\`🔘\` **Activer les modmails**`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        }, 
                                    }],
                                    components: [ row ]
                                })
                            } else {
                                array[0] = 'enable'
                                await db.set(`client_${client.user.id}_modmails`, array)
    
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Désactiver les modmails**`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        }, 
                                    }],
                                    components: [ row ]
                                }).then(async () => {
                                    const cat = client.channels.cache.get(array[1])
                                    if(cat) {
                                        return;
                                    } else {
                                        await message.guild.channels.create(`Modmail`, {
                                            type: 'GUILD_CATEGORY'
                                        }).then(async (i) => {
                                            array[1] = `${i.id}`
                                            await db.set(`client_${client.user.id}_modmails`, array)
                                        })
                                    }
                                })
                            }
                        }
                        awaitButtons();
                        break;
                    }

                    case 'roles': {
                        console.log('a finir')
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    } else {

    }

    }
}