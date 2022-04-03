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

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.add(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                } else if(args[1]) {
                    const role = message.guild.roles.cache.get(args[1])
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle introuvable.`})

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.add(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                }
                break;
            }

            case 'remove': {
                if(message.mentions.roles.first()) {
                    const role = message.mentions.roles.first()
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle introuvable.`})

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.remove(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                } else if(args[1]) {
                    const role = message.guild.roles.cache.get(args[1])
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} rôle introuvable.`})

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.remove(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                }
                break;
            }
        }
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        switch(args[0]) {
            case 'add': {
                if(message.mentions.roles.first()) {
                    const role = message.mentions.roles.first()
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} role not found.`})

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.add(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                } else if(args[1]) {
                    const role = message.guild.roles.cache.get(args[1])
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} role not found.`})

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.add(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                }
                break;
            }

            case 'remove': {
                if(message.mentions.roles.first()) {
                    const role = message.mentions.roles.first()
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} role not found.`})

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.remove(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                } else if(args[1]) {
                    const role = message.guild.roles.cache.get(args[1])
                    if(!role) return message.channel.send({ content: `:x: - ${message.author} role not found.`})

                    const members = await message.guild.members.fetch();

                    for await (const [,member] of members) {
                        await member.roles.remove(role.id);
                        await sleep(1000); // attendre 1 seconde
                    }
                }
                break;
            }
        }
    }

    }
}