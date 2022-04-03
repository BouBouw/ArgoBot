const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "recup",
    aliases: ['recuperation'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const bot_settings = db.get(`bot_settings_${client.user.id}`)

    if(arr[0] === 'FR_fr') {
        if(args[0]) {
            const code = Number(args[0])
            if(code === db.fetch(`client_${client.user.id}_code`)) {
                bot_settings[2] = `${message.author.id}`
                db.set(`bot_settings_${client.user.id}`, bot_settings)
                await message.channel.send({ content: `:white_check_mark: - ${message.author} vous êtes désormais l'owner **principal** sur ${client.user.tag}.`})
                await db.delete(`client_${client.user.id}_code`)
            }
        } else {
            if(message.author.id !== bot_settings[2]) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})
            
            const random = Math.floor(Math.random() * 10000000)
            await db.set(`client_${client.user.id}_code`, random)
            message.author.send({ content: `${message.author}, \nVoici votre code de récupération de **__${client.user.tag}__**\nCode > ||${random}||\n\n:warning: - **__Ce code disparaît dans 5 minutes.__**`}).then(async (msg) => {
                setTimeout(async () => {
                    await msg.delete()
                }, 300000)
            })
        }
    } else {
        if(args[0]) {
            const code = Number(args[0])
            if(code === db.fetch(`client_${client.user.id}_code`)) {
                bot_settings[2] = `${message.author.id}`
                db.set(`bot_settings_${client.user.id}`, bot_settings)
                await message.channel.send({ content: `:white_check_mark: - ${message.author} you are now the **main** owner of ${client.user.tag}.`})
                await db.delete(`client_${client.user.id}_code`)
            }
        } else {
            if(message.author.id !== bot_settings[2]) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
            
            const random = Math.floor(Math.random() * 10000000)
            await db.set(`client_${client.user.id}_code`, random)
            message.author.send({ content: `${message.author}, \nHere is your recovery code **__${client.user.tag}__**\nCode > ||${random}||\n\n:warning: - **__This code disappears in 5 minutes.__**`}).then(async (msg) => {
                setTimeout(async () => {
                    await msg.delete()
                }, 300000)
            })
        }
    }

    }
}