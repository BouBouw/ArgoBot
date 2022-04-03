const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "ownerlist",
    aliases: ['ownlist'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const bot_settings = db.get(`bot_settings_${client.user.id}`)

    const embed = new MessageEmbed()

    const menu = new MessageButton({
        customId: "add",
        label: "",
        style: "SECONDARY",
        emoji: "➕",
      })
    const menu_1 = new MessageButton({
        customId: "remove",
        label: "",
        style: "SECONDARY",
        emoji: "➖",
    })
    const menu_2 = new MessageButton({
        customId: "list",
        label: "",
        style: "SUCCESS",
        emoji: "📑",
    })
    const menu_3 = new MessageButton({
        customId: "reset",
        label: "",
        style: "DANGER",
        emoji: "♻️",
    })
      const row = new MessageActionRow({
          components: [ menu_2, menu, menu_1, menu_3 ]
      })

    if(arr[0] === 'FR_fr') {
        const array = db.get(`client_${client.user.id}_ownerlist`)
        if(message.author.id !== bot_settings[2]) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Liste des owners`)
        embed.setDescription(`\`📑\` **Voir la liste des owners**\n\n\`➕\` **Ajouter un membre**\n\`➖\` **Retirer un membre**\n\n\`♻️\` **Réinitaliser la liste des owners**`)
        embed.setTimestamp()
        embed.setFooter(client.user.username)

        await message.channel.send({ 
            content: `${message.author},`,
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

                switch (collected.customId) {
                    case 'add': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} mentionner ou envoyer l'identifiant du membre à ajouté à la liste des owners` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} utilisateur invalide, opération annulée` }).then(async () => {
                                await msg.delete()
                            })
        
                            const array = db.get(`client_${client.user.id}_ownerlist`)
                            if(!array) {
                                db.set(`client_${client.user.id}_ownerlist`, [`${user.id}`])
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été ajouté à la liste des owners.` })
                            } else {
                                if(!array.includes(user.id)) {
                                    if(db.get(`client_${client.user.id}_ownerlist`) == null) {
                                        db.set(`client_${client.user.id}_ownerlist`, [`${user.id}`])
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été ajouté à la liste owners.` })
                                    } else {
                                        db.push(`client_${client.user.id}_ownerlist`, user.id)
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été ajouté à la liste owners.` })
                                    }
                                } else {
                                    return message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) est déjà dans la liste des owners.`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'remove': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} mentionner ou envoyer l'identifiant du membre à retirer à la liste des owners` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} utilisateur invalide, opération annulée` }).then(async () => {
                                await msg.delete()
                            })

                            const array = db.get(`client_${client.user.id}_ownerlist`)
                            if(!array) {
                                message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) n'est pas dans la liste des owners`})
                            } else {
                                if(!array.includes(user.id)) {
                                    message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) n'est pas dans la liste des owners`})
                                } else {
                                    const index = array.findIndex(id => id === user.id);
                                    const filtered = array.filter(id => id !== user.id);
                                    db.set(`client_${client.user.id}_ownerlist`, filtered)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été retiré de la liste des owners`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'list': {
                        const list = [];
                        const array = db.get(`client_${client.user.id}_ownerlist`)
                        if(!array) {
                            embed.setDescription(`Aucun membre dans la liste des owners`)
                            await msg.edit({ embeds: [ embed] })
                        } else {
                            await array.map(async (id) => {
                                list.push(`${client.users.cache.get(id)} (\`${id}\`)`)
                            })
                        embed.setDescription(`${list.join('\n')}`)
                        await msg.edit({ embeds: [ embed] })
                        }
                        awaitButtons()
                        break;
                    }

                    case 'reset': {
                        db.delete(`client_${client.user.id}_ownerlist`)
                        await message.channel.send({ content: `:white_check_mark: - ${message.author} la liste des owners à correctement été réinitalisée.` })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    } else {
        if(message.author.id !== bot_settings[2]) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
        const array = db.get(`client_${client.user.id}_ownerlist`)

        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`ownerlist`)
        embed.setDescription(`\`📑\` **Show ownerlist**\n\n\`➕\` **Add member**\n\`➖\` **Remove member**\n\n\`♻️\` **Reset ownerlist**`)
        embed.setTimestamp()
        embed.setFooter(client.user.username)

        await message.channel.send({ 
            content: `${message.author},`,
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

                switch (collected.customId) {
                    case 'add': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} mention or send the member ID to be added to the ownerlist.` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} invalid user, operation canceled` }).then(async () => {
                                await msg.delete()
                            })
        
                            const array = db.get(`client_${client.user.id}_ownerlist`)
                            if(!array) {
                                db.set(`client_${client.user.id}_ownerlist`, [`${user.id}`])
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been added to the ownerlist.` })
                            } else {
                                if(!array.includes(user.id)) {
                                    if(db.get(`client_${client.user.id}_ownerlist`) == null) {
                                        db.set(`client_${client.user.id}_ownerlist`, [`${user.id}`])
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been added to the ownerlist.` })
                                    } else {
                                        db.push(`client_${client.user.id}_ownerlist`, user.id)
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been added to the ownerlist.` })
                                    }
                                } else {
                                    return message.channel.send({ content: `:x: - ${message.author} the user ${user} (\`${user.id}\`) is already in the ownerlist.`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'remove': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} mention or send the member ID to be removed to the ownerlist.` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} invalid user, operation canceled` }).then(async () => {
                                await msg.delete()
                            })

                            const array = db.get(`client_${client.user.id}_ownerlist`)
                            if(!array) {
                                message.channel.send({ content: `:x: - ${message.author} the user ${user} (\`${user.id}\`) is not in the ownerlist.`})
                            } else {
                                if(!array.includes(user.id)) {
                                    message.channel.send({ content: `:x: - ${message.author} the user ${user} (\`${user.id}\`) is not in the ownerlist.`})
                                } else {
                                    const index = array.findIndex(id => id === user.id);
                                    const filtered = array.filter(id => id !== user.id);
                                    db.set(`client_${client.user.id}_ownerlist`, filtered)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been removed to the ownerlist.`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'list': {
                        console.log(db.get(`client_${client.user.id}_ownerlist`))
                        const list = [];
                        const array = db.get(`client_${client.user.id}_ownerlist`)
                        if(!array) {
                            embed.setDescription(`No member in the ownerlist`)
                            await msg.edit({ embeds: [ embed] })
                        } else {
                            await array.map(async (id) => {
                                list.push(`${client.users.cache.get(id)} (\`${id}\`)`)
                            })
                        embed.setDescription(`${list.join('\n')}`)
                        await msg.edit({ embeds: [ embed] })
                        }
                        awaitButtons()
                        break;
                    }

                    case 'reset': {
                        db.delete(`client_${client.user.id}_ownerlist`)
                        await message.channel.send({ content: `:white_check_mark: - ${message.author} the ownerlist has been correctly reinitialized.` })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    }

    }
}