const { Permissions, MessageEmbed } = require('discord.js')
const db = require("quick.db")
const ms = require('ms');

module.exports = {
    name: "mutelist",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const embed = new MessageEmbed()

    if(arr[0] === 'FR_fr') {
        const list = [];
        const array = db.get(`client_${client.user.id}_muted`)
        if(!array) {
            embed.setTitle(`Liste des muets`)
            embed.setDescription(`Aucun membre muet`)
            await message.channel.send({ embeds: [ embed] })
        } else {
            await array.map(async (id) => {
                list.push(`${client.users.cache.get(id)} (\`${id}\`)`)
            })
        embed.setTitle(`Liste des muets`)
        embed.setDescription(`${list.join('\n')}`)
        await message.channel.send({ embeds: [ embed] })
        }
    } else {
        const list = [];
        const array = db.get(`client_${client.user.id}_muted`)
        if(!array) {
            embed.setTitle(`Muted list`)
            embed.setDescription(`No member muted`)
            await message.channel.send({ embeds: [ embed] })
        } else {
            await array.map(async (id) => {
                list.push(`${client.users.cache.get(id)} (\`${id}\`)`)
            })
        embed.setTitle(`Muted list`)
        embed.setDescription(`${list.join('\n')}`)
        await message.channel.send({ embeds: [ embed] })
        }
    }

    }
}