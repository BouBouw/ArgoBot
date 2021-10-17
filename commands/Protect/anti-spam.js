const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "anti-spam",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const embed = new MessageEmbed()

    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] == 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        if(db.get(`client_${client.user.id}_security_antispam`) == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }
    
        const menu = new MessageButton({
            customId: "click",
            label: "",
            style: "PRIMARY",
            emoji: "🔘",
        })
        const row = new MessageActionRow({
          components: [ menu ]
        })
    
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Statut: \`${statut}\``)
        embed.setDescription(`🔘 **Activer/Désactiver l'anti-liens**`)
        embed.setTimestamp()
        embed.setFooter(client.user.username)
        message.channel.send({ embeds: [embed] }).then(async (msg) => {
            const filter = (interaction) => interaction.user.id === message.author.id && interaction.isButton();
            awaitButtons()
    
            async function awaitButtons() {
                let collected;
                try {
                    collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
                } catch (err) {
                    if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                        return msg.delete()
                    }
                }
    
                if (!collected.deffered) await collected.deferUpdate();
    
                switch (collected.customId) {
                    case 'click': {
                        if(db.get(`client_${client.user.id}_security_antispam`) == 'enable') {
                            db.set(`client_${client.user.id}_security_antispam`, 'disable')
                                embed.setTitle(`Statut: \`❌\``)
                                await msg.edit({ embeds: [embed] })
                        } else {
                            db.set(`client_${client.user.id}_security_antispam`, 'enable')
                                embed.setTitle(`Statut: \`✅\``)
                                await msg.edit({ embeds: [embed] })
                        }
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        if(db.get(`client_${client.user.id}_security_antispam`) == 'enable') {
            statut = '✅'
        } else {
            statut = '❌'
        }
    
        const menu = new MessageButton({
            customId: "click",
            label: "",
            style: "PRIMARY",
            emoji: "🔘",
        })
        const row = new MessageActionRow({
          components: [ menu ]
        })
    
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Statut: \`${statut}\``)
        embed.setDescription(`🔘 **Enable/Disable anti-spam**`)
        embed.setTimestamp()
        embed.setFooter(client.user.username)
        message.channel.send({ embeds: [embed] }).then(async (msg) => {
            const filter = (interaction) => interaction.user.id === message.author.id && interaction.isButton();
            awaitButtons()
    
            async function awaitButtons() {
                let collected;
                try {
                    collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
                } catch (err) {
                    if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                        return msg.delete()
                    }
                }
    
                if (!collected.deffered) await collected.deferUpdate();
    
                switch (collected.customId) {
                    case 'click': {
                        if(db.get(`client_${client.user.id}_security_antispam`) == 'enable') {
                            db.set(`client_${client.user.id}_security_antispam`, 'disable')
                                embed.setTitle(`Statut: \`❌\``)
                                await msg.edit({ embeds: [embed] })
                        } else {
                            db.set(`client_${client.user.id}_security_antispam`, 'enable')
                                embed.setTitle(`Statut: \`✅\``)
                                await msg.edit({ embeds: [embed] })
                        }
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    }

   }
}