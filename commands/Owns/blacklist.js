const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "blacklist",
    aliases: ['bl'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const ownerlist = db.get(`client_${client.user.id}_ownerlist`)
    const bot_settings = db.get(`bot_settings_${client.user.id}`)

    const embed = new MessageEmbed()

    const menu = new MessageButton({
        customId: "add",
        label: "",
        style: "PRIMARY",
        emoji: "➕",
      })
    const menu_1 = new MessageButton({
        customId: "remove",
        label: "",
        style: "PRIMARY",
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
        const array = db.get(`client_${client.user.id}_blacklist`)
        if(message.author.id !== bot_settings[2] && !ownerlist.includes(message.author.id)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Liste noire`)
        embed.setDescription(`\`📑\` **Voir la liste noire**\n\n\`➕\` **Ajouter un membre**\n\`➖\` **Retirer un membre**\n\n\`♻️\` **Réinitaliser la liste noire**`)
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
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} mentionner ou envoyer l'identifiant du membre à ajouté à la liste noire` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} utilisateur invalide, opération annulée` }).then(async () => {
                                await msg.delete()
                            })
        
                            const array = db.get(`client_${client.user.id}_blacklist`)
                            if(!array) {
                                db.set(`client_${client.user.id}_blacklist`, [`${user.id}`])
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été ajouté à la liste noire.` })
                            } else {
                                if(!array.includes(user.id)) {
                                    if(db.get(`client_${client.user.id}_blacklist`) == null) {
                                        db.set(`client_${client.user.id}_blacklist`, [`${user.id}`])
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été ajouté à la liste noire.` })
                                    } else {
                                        db.push(`client_${client.user.id}_blacklist`, user.id)
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) à été ajouté à la liste noire.` })
                                    }
                                } else {
                                    return message.channel.send({ content: `:x: - ${message.author} l'utilisateur ${user} (\`${user.id}\`) est déjà dans la liste noire.`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'remove': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} envoyer l'identifiant du membre à retirer à la liste noire` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().content
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} utilisateur invalide, opération annulée` }).then(async () => {
                                await msg.delete()
                            })

                            const array = db.get(`client_${client.user.id}_blacklist`)
                            if(!array) {
                                message.channel.send({ content: `:x: - ${message.author} l'utilisateur (\`${user}\`) n'est pas dans la liste noire`})
                            } else {
                                if(!array.includes(user.id)) {
                                    message.channel.send({ content: `:x: - ${message.author} l'utilisateur (\`${user}\`) n'est pas dans la liste noire`})
                                } else {
                                    const index = array.findIndex(id => id === user);
                                    const filtered = array.filter(id => id !== user);
                                    db.set(`client_${client.user.id}_blacklist`, filtered)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur (\`${user}\`) à été retiré de la liste noire`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'list': {
                        const list = [];
                        const array = db.get(`client_${client.user.id}_blacklist`)
                        if(!array) {
                            embed.setDescription(`Aucun membre dans la liste noire`)
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
                        db.delete(`client_${client.user.id}_blacklist`)
                        await message.channel.send({ content: `:white_check_mark: - ${message.author} la liste blanche à correctement été réinitalisée.` })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    } else {
        if(message.author.id !== bot_settings[2] && !ownerlist.includes(message.author.id)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
        const array = db.get(`client_${client.user.id}_blacklist`)

        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Whitelist`)
        embed.setDescription(`\`📑\` **Show blacklist**\n\n\`➕\` **Add member**\n\`➖\` **Remove member**\n\n\`♻️\` **Reset blacklist**`)
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
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} mention or send the member ID to be added to the blacklist.` })
                        const filter = (m) => m.author.id ===  message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} invalid user, operation canceled` }).then(async () => {
                                await msg.delete()
                            })
        
                            const array = db.get(`client_${client.user.id}_blacklist`)
                            if(!array) {
                                db.set(`client_${client.user.id}_blacklist`, [`${user.id}`])
                                await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been added to the blacklist.` })
                            } else {
                                if(!array.includes(user.id)) {
                                    if(db.get(`client_${client.user.id}_blacklist`) == null) {
                                        db.set(`client_${client.user.id}_blacklist`, [`${user.id}`])
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been added to the blacklist.` })
                                    } else {
                                        db.push(`client_${client.user.id}_blacklist`, user.id)
                                        await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user} (\`${user.id}\`) has been added to the blacklist.` })
                                    }
                                } else {
                                    return message.channel.send({ content: `:x: - ${message.author} the user ${user} (\`${user.id}\`) is already in the blacklist.`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'remove': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} send the member ID to be removed to the blacklist.` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()
                            question.delete()
        
                            const user = collected.first().content
                            if(!user) return message.channel.send({ content: `:x: - ${message.author} invalid user, operation canceled` }).then(async () => {
                                await msg.delete()
                            })

                            const array = db.get(`client_${client.user.id}_blacklist`)
                            if(!array) {
                                message.channel.send({ content: `:x: - ${message.author} the user (\`${user}\`) is not in the blacklist.`})
                            } else {
                                if(!array.includes(user.id)) {
                                    message.channel.send({ content: `:x: - ${message.author} the user (\`${user.id}\`) is not in the blacklist.`})
                                } else {
                                    const index = array.findIndex(id => id === user.id);
                                    const filtered = array.filter(id => id !== user.id);
                                    db.set(`client_${client.user.id}_blacklist`, filtered)
                                    await message.channel.send({ content: `:white_check_mark: - ${message.author} the user (\`${user.id}\`) has been removed to the blacklist.`})
                                }
                            }
                        })
                        awaitButtons()
                        break;
                    }

                    case 'list': {
                        console.log(db.get(`client_${client.user.id}_blacklist`))
                        const list = [];
                        const array = db.get(`client_${client.user.id}_blacklist`)
                        if(!array) {
                            embed.setDescription(`No member in the blacklist`)
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
                        db.delete(`client_${client.user.id}_blacklist`)
                        await message.channel.send({ content: `:white_check_mark: - ${message.author} the blacklist has been correctly reinitialized.` })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    }

    }
}