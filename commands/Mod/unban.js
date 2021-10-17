const { Permissions } = require('discord.js');
const db = require("quick.db")

module.exports = {
    name: "unban",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    if(arr[0] === 'FR_fr') {
        if(!message.member.hasPermission(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const id = args[0]
        const bannedUsers = await message.guild.fetchBans();
        const user = bannedUsers.get(id).user;
    
        await message.guild.members.unban(id).then(async () => {
            await message.channel.send({ content: `:white_check_mark: - ${message.author} l'utilisateur ${user.tag} (\`${user.id}\`) à été correctement débanni.`})
        })
        .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} une erreur est survenue.`}))
    } else {
        if(!message.member.hasPermission(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const id = args[0]
        const bannedUsers = await message.guild.fetchBans();
        const user = bannedUsers.get(id).user;
    
        await message.guild.members.unban(id).then(async () => {
            await message.channel.send({ content: `:white_check_mark: - ${message.author} the user ${user.tag} (\`${user.id}\`) has been properly unbanned.`})
        })
        .catch((err) => message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} an error has occurred.`}))
    }
    
    }
}