const { MessageEmbed, Permissions } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "massiverole",
    aliases: ['massrole'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    let count = 0;
    let error = 0;

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        switch(args[0]) {
            case 'add': {
                if(message.mentions.roles.first()) {
                    const role = message.mentions.roles.first()
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle introuvable.`})

                    let msg = await message.channel.send({
                        content: `Ajout du rôle ${role} (\`${role.id}\`) à ${message.guild.memberCount} membres`
                    })
                    message.guild.members.cache.forEach(async (user) => {
                        user.roles.add(role).then(async () => {
                            count = count + 1;
                        })
                        .catch(async (err) => {
                            error = error + 1;
                        })
                    })
                } else if(args[1]) {
                    const role = message.guild.roles.cache.get(args[1])
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle introuvable.`})

                    let msg = await message.channel.send({
                        content: `Ajout du rôle ${role} (\`${role.id}\`) à ${message.guild.memberCount} membres`
                    })
                    message.guild.members.cache.forEach(async (user) => {
                        user.roles.add(role).then(async () => {
                            count = count + 1;
                        })
                        .catch(async (err) => {
                            error = error + 1;
                        })
                    })
                }
                break;
            }

            case 'remove': {
                if(message.mentions.roles.first()) {
                    const role = message.mentions.roles.first()
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle introuvable.`})

                    let msg = await message.channel.send({
                        content: `Rejet du rôle ${role} (\`${role.id}\`) à ${message.guild.memberCount} membres`
                    })
                    message.guild.members.cache.forEach(async (user) => {
                        user.roles.remove(role).then(async () => {
                            count = count + 1;
                        })
                        .catch(async (err) => {
                            error = error + 1;
                        })
                    })
                } else if(args[1]) {
                    const role = message.guild.roles.cache.get(args[1])
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle introuvable.`})

                    let msg = await message.channel.send({
                        content: `Rejet du rôle ${role} (\`${role.id}\`) à ${message.guild.memberCount} membres`
                    })
                    message.guild.members.cache.forEach(async (user) => {
                        user.roles.remove(role).then(async () => {
                            count = count + 1;
                        })
                        .catch(async (err) => {
                            error = error + 1;
                        })
                    })
                }
                break;
            }
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
    }

    }
}