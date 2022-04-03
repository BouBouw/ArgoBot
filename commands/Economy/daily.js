const db = require('quick.db');
const ms = require("parse-ms");

module.exports = {
    name: "daily",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    let timeout = 86400000;
    let amount = 150;

    let timer = await db.fetch(`daily_${message.guild.id}_${message.author.id}`)

    switch(arr[0]) {
        case 'FR_fr': {
            if(timer !== null && timeout - (Date.now() - timer) > 0) {
                let time = ms(timeout - (Date.now() - timer));
                return message.channel.send({ content: `⏳ - ${message.author} vous devez attendre encore **${time.hours}** heure(s), **${time.minutes}** minute(s) et **${time.seconds}** seconde(s) avant de pouvoir récupérer votre récompense quotidienne.` })
            } else {
                message.channel.send({ content: `:white_check_mark: - ${message.author} vous venez de récupérer vos **${amount} coins** journalier.` })
                db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, amount)
                db.set(`daily_${message.guild.id}_${message.author.id}`, Date.now())
            }

            break;
        }

        case 'EN_en': {
            if(timer !== null && timeout - (Date.now() - timer) > 0) {
                let time = ms(timeout - (Date.now() - timer));
                return message.channel.send({ content: `⏳ - ${message.author} you still have to wait **${time.hours}** hour(s), **${time.minutes}** minute(s) et **${time.seconds}** second(s) before you can collect your daily reward.` })
            } else {
                message.channel.send({ content: `:white_check_mark: - ${message.author} you just got your **${amount} coins** daily.` })
                db.add(`guild_${message.guild.id}_users_${message.author.id}_coins`, amount)
                db.set(`daily_${message.guild.id}_${message.author.id}`, Date.now())
            }

            break;
        }
    }
    }
}