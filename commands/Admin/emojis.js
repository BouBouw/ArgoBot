const { MessageEmbed, Permissions, Util } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "emojis",
    aliases: ['emoji'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        switch(args[0]) {
            case 'add': {
                const emoji_args = args[1]
                if(!emoji_args) return message.channel.send({
                    content: `:x: - ${message.author} veuillez fournir un emoji à ajouter au serveur.`
                })

                for (const emojis of args) {
                    const getEmoji = Util.parseEmoji(emojis);

                    if(getEmoji.id) {
                        const name = args[2]
                        if(!name) return message.channel.send({
                            content: `:x: - ${message.author} veuillez fournir un nom à votre emoji.`
                        })
                        const emojiExt = getEmoji.animated ? '.gif' : '.png';
                        const emojiUrl = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExt}`;
                        message.guild.emojis.create(emojiUrl, name)
                            .then(async (emoji) => {
                                message.channel.send({ 
                                    content: `✅ - ${message.author} l'emoji <:${emoji.name}:${emoji.id}> à correctement été ajouté sous le nom de \`${emoji.name}\`.`
                                })
                            })
                            .catch((err) => {
                                message.channel.send({
                                    content: `:warning: - ${message.author} une erreur est survenue lors de la création de l'emoji`
                                })
                            })
                    }
                }
                break;
            }

            case 'remove': {
                const emojiID = args[1]
                if(!emojiID) return message.channel.send({
                    content: `:x: - ${message.author} veuillez fournir un emoji du serveur valide.`
                })

                for (const emojis of args) {
                    const getEmoji = Util.parseEmoji(emojis);

                    if(getEmoji.id) {
                        if(message.guild.emojis.cache.find(emoji => emoji.id === getEmoji.id)) {
                            const emoji = message.guild.emojis.cache.find(emoji => emoji.id === getEmoji.id)
                            message.channel.send({
                                content: `✅ - ${message.author} l'emoji ${emoji} à bien été supprimé du serveur.`
                            }).then(async () => {
                                emoji.delete()
                            })
                            .catch((err) => {
                                message.channel.send({
                                    content: `:warning: - ${message.author} une erreur est survenue lors de la création de l'emoji`
                                })
                            })
                        } else {
                            message.channel.send({
                                content: `:x: - ${message.author} veuillez fournir un emoji du sevreur valide.`
                            })
                        }
                    }
                }
                break;
            }

            case 'infos': {
                const emojiID = args[1]
                if(!emojiID) return message.channel.send({
                    content: `:x: - ${message.author} veuillez fournir un emoji du serveur valide.`
                })

                for (const emojis of args) {
                    const getEmoji = Util.parseEmoji(emojis);

                    if(getEmoji.id) {
                        if(message.guild.emojis.cache.find(emoji => emoji.id === getEmoji.id)) {
                            const emoji = message.guild.emojis.cache.find(emoji => emoji.id === getEmoji.id)

                            const emojiExt = getEmoji.animated ? '.gif' : '.png';
                            const emojiUrl = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExt}`;

                            message.channel.send({
                                content: `Visuel: ${emoji}\n\nNom: \`:${emoji.name}:\`\nIdentifiant: \`${emoji.id}\``,
                                files: [`${emoji.url}`]
                            })
                        } else {
                            message.channel.send({
                                content: `:x: - ${message.author} veuillez fournir un emoji du sevreur valide.`
                            })
                        }
                    }
                }
                break;
            }

            case 'edit': {
                const emojiID = args[1]
                if(!emojiID) return message.channel.send({
                    content: `:x: - ${message.author} veuillez fournir un emoji du serveur valide.`
                })

                for (const emojis of args) {
                    const getEmoji = Util.parseEmoji(emojis);

                    if(getEmoji.id) {
                        if(message.guild.emojis.cache.find(emoji => emoji.id === getEmoji.id)) {
                            const emoji = message.guild.emojis.cache.find(emoji => emoji.id === getEmoji.id)
                            const newName = args[2]
                            if(!newName) return message.channel.send({
                                content: `:x: - ${message.author} veuillez fournir un nouveau nom à l'emoji.`
                            })

                            emoji.edit({
                                name: `${newName}`
                            }).then(async () => {
                                message.chanel.send({
                                    content: `✅ - ${message.author} le nom de l'emoji ${emoji} vient d'être modifié en \`:${newName}:\``
                                })
                            })
                            .catch((err) => {
                                message.channel.send({
                                    content: `:warning: - ${message.author} une erreur est survenue lors de la création de l'emoji`
                                })
                            })
                        } else {
                            message.channel.send({
                                content: `:x: - ${message.author} veuillez fournir un emoji du sevreur valide.`
                            })
                        }
                    }
                }
            }
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
    }

    }
}