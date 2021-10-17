const { Permissions } = require('discord.js')
const db = require("quick.db")

module.exports = {
    name: "clear",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        const count = Number(args[0])
        if(!count || isNaN(count)) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre de messages à éffacer.`})
        if(count <= 0 || count >= 100) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre entre **1** et **100**`})
    
        message.channel.bulkDelete(Math.floor(count + 1), true).then(() => {
           if (count == 1) {var s = ""} else {var s = "s"}
        }).then(async () => {
            message.channel.send({ content: `:white_check_mark: - ${message.author} à supprimer **${count} messages**`})
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        const count = Number(args[0])
        if(!count || isNaN(count)) return message.channel.send({ content: `:x: - ${message.author} please provide a number of messages to delete.`})
        if(count <= 0 || count >= 100) return message.channel.send({ content: `:x: - ${message.author} please provide a number between **1** and **100**`})
    
        message.channel.bulkDelete(Math.floor(count + 1), true).then(() => {
           if (count == 1) {var s = ""} else {var s = "s"}
        }).then(async () => {
            message.channel.send({ content: `:white_check_mark: - ${message.author} to delete **${count} messages**`})
        })
    }

    }
}