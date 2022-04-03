const { Permissions } = require('discord.js')
const db = require('quick.db');

module.exports = {
    name: "ban",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send(`:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`)

        const user = message.mentions.members.first()
        if(!user) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un membre a bannir.`})
    
        const reason = args.slice(1).join(" ") || "Aucune raison fournie"
    
        await user.ban({ reason: reason })
            .then(async () => {
                await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user.tag} (\`${user.id}\`) à été correctement banni.`})
            })
            .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} une erreur est survenue.`}))
            
            await sendLogs();

            async function sendLogs() {
                const ch = db.get(`client_${client.user.id}_logs`)
                const logs = message.guild.channels.cache.get(ch[1])

                await logs.send({
                    embeds: [{
                        color: `#32a88b`,
                        description: `[\`BANNISSEMENT\`] ${message.author} (\`${message.author.id}\`) à banni ${user.tag} (\`${user.id}\`)`,
                        author: {
                            name: `${message.author.tag}`,
                            icon_url: `${message.author.avatarURL()}`,
                        },
                        fields: [
                            {
                                name: `Raison`,
                                value: `\`\`\`${reason}\`\`\``
                            }
                        ]
                    }]
                })
            }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send(`:x: - ${message.author} you do not have permission to use this command.`)

        const user = message.mentions.members.first()
        if(!user) return message.channel.send({ content: `:x: - ${message.author} please provide a member to be banned.`})
    
        const reason = args.slice(1).join(" ") || "No reason given"
    
        await user.ban({ reason: reason })
            .then(async () => {
                await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user.tag} (\`${user.id}\`) has been properly banned.`})
            })
            .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} an error has occurred.`}))

            await sendLogs();

            async function sendLogs() {
                const ch = db.get(`client_${client.user.id}_logs`)
                const logs = message.guild.channels.cache.get(ch[1])

                await logs.send({
                    embeds: [{
                        color: `#32a88b`,
                        description: `[\`BAN\`] ${message.author} (\`${message.author.id}\`) has banned ${user.tag} (\`${user.id}\`)`,
                        author: {
                            name: `${message.author.tag}`,
                            icon_url: `${message.author.avatarURL()}`,
                        },
                        fields: [
                            {
                                name: `Reason`,
                                value: `\`\`\`${reason}\`\`\``
                            }
                        ]
                    }]
                })
            }
    }
    }
}