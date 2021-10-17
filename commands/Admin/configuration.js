const { MessageEmbed, Permissions } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "configuration",
    aliases: ['config'],
    description: "",
execute: async (client, message, args) => {
    const embed = new MessageEmbed()
    if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

    if(db.get(`client_${client.user.id}_security_webhooks`) == 'enable') { whStatut = '`✅`' } else { whStatut = '`❌`' }
    if(db.get(`client_${client.user.id}_security_bots`) == 'enable') { botSatut = '`✅`' } else { botSatut = '`❌`' }
    if(db.get(`client_${client.user.id}_security_join`) == 'enable') { joinStatus = '`✅`' } else { joinStatus = '`❌`' }
    if(db.get(`client_${client.user.id}_security_antilink`) == 'enable') { linkStatus = '`✅`' } else { linkStatus = '`❌`' }
    if(db.get(`client_${client.user.id}_security_antispam`) == 'enable') { spamStatus = '`✅`' } else { spamStatus = '`❌`' }

    if(db.get(`client_${client.user.id}_security_level`) == 1) { levelStatus = 'faible' } else if(db.get(`client_${client.user.id}_security_level`) == 2) { levelStatus = 'moyenne' } else if(db.get(`client_${client.user.id}_security_level`) == 3) { levelStatus = 'élevée' } else { levelStatus = 'aucune' }

    if(db.get(`client_${client.user.id}_coins`) == 'enable') { coins = '`✅`' } else { coins = '`❌`' }
    const normal = db.fetch(`client_${client.user.id}_coins_normal`) || 10; const stream = db.fetch(`client_${client.user.id}_coins_stream`) || 5; const mute = db.fetch(`client_${client.user.id}_coins_mute`) || 5;

    embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    embed.setTitle(`Configuration`)
    embed.addField(`Sécurité automatique`, `\`${levelStatus}\``)
    embed.addField(`Gestion serveur`, `Anti-webhooks: ${whStatut}\nAnti-spam: ${spamStatus}\nAnti-link: ${linkStatus}`)
    embed.addField(`Gestion utilisateur(s)`, `Anti-bot: ${botSatut}\nAnti-join: ${joinStatus}`)
    embed.addField(`Gestion économie`, `Coins: ${coins}\n↳ **Normal:** ${normal} | ↳ **Streaming:** ${stream} | ↳ **Muets:** ${mute}`)
    embed.setColor('ORANGE')
    message.channel.send({ embeds: [embed] })
    }
}