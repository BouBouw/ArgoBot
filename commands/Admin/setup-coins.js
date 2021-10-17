const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "set-coins",
    aliases: ['setup-coins'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const embed = new MessageEmbed()

    if(arr[0] == 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        if(db.get(`client_${client.user.id}_coins`) == 'enable') {
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
        const menu_1 = new MessageButton({
            customId: "normal",
            label: "",
            style: "PRIMARY",
            emoji: "1⃣",
        })
        const menu_2 = new MessageButton({
            customId: "mute",
            label: "",
            style: "PRIMARY",
            emoji: "2⃣",
        })
        const menu_3 = new MessageButton({
            customId: "stream",
            label: "",
            style: "PRIMARY",
            emoji: "3⃣",
        })
        const row = new MessageActionRow({
          components: [ menu, menu_1, menu_2, menu_3 ]
        })
    
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Statut: \`${statut}\``)
        embed.setDescription(`\`🔘\` **Activer/Désactiver le système de coins**\n\n\`1⃣\` **Modifier le nombre de coins normal**\n\`2⃣\` **Modifier le nombre de coins muet**\n\`3⃣\` **Modifier le nombre de coins streaming**`)
        embed.setTimestamp()
        embed.setFooter(client.user.username)
        message.channel.send({ embeds: [embed], components: [ row ] }).then(async (msg) => {
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
                        if(db.get(`client_${client.user.id}_coins`) == 'enable') {
                            db.set(`client_${client.user.id}_coins`, 'disable')
                                embed.setTitle(`Statut: \`❌\``)
                                await msg.edit({ embeds: [embed] })
                        } else {
                            db.set(`client_${client.user.id}_coins`, 'enable')
                                embed.setTitle(`Statut: \`✅\``)
                                await msg.edit({ embeds: [embed] })
                        }
                        awaitButtons()
                        break;
                    }

                    case 'normal': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez envoyer le nombre de coins à attribuer (**normal**)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            if(isNaN(collected.first().content) || collected.first().content < 0) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre valide.` })
                            await db.set(`client_${client.user.id}_coins_normal`, [`${collected.first().content}`])
                        })
                        awaitButtons()
                        break;
                    }

                    case 'mute': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez envoyer le nombre de coins à attribuer (**muets**)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            if(isNaN(collected.first().content) || collected.first().content < 0) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre valide.` })
                            await db.push(`client_${client.user.id}_coins_muted`, collected.first().content)
                        })
                        awaitButtons()
                        break;
                    }

                    case 'stream': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} veuillez envoyer le nombre de coins à attribuer (**muets**)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            if(isNaN(collected.first().content) || collected.first().content < 0) return message.channel.send({ content: `:x: - ${message.author} veuillez fournir un nombre valide.` })
                            await db.set(`client_${client.user.id}_coins-stream`, collected.first().content)
                        })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        if(db.get(`client_${client.user.id}_coins`) == 'enable') {
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
        const menu_1 = new MessageButton({
            customId: "normal",
            label: "",
            style: "PRIMARY",
            emoji: "1⃣",
        })
        const menu_2 = new MessageButton({
            customId: "mute",
            label: "",
            style: "PRIMARY",
            emoji: "2⃣",
        })
        const menu_3 = new MessageButton({
            customId: "stream",
            label: "",
            style: "PRIMARY",
            emoji: "3⃣",
        })
        const row = new MessageActionRow({
          components: [ menu, menu_1, menu_2, menu_3 ]
        })
    
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        embed.setTitle(`Statut: \`${statut}\``)
        embed.setDescription(`\`🔘\` **Enable/Disable the coins system**\n\n\`1⃣\` **Change the normal number of coins**\n\`2⃣\` **Change the muted number of coins**\n\`3⃣\` **Change the streaming number of coins**`)
        embed.setTimestamp()
        embed.setFooter(client.user.username)
        message.channel.send({ embeds: [embed], components: [ row ] }).then(async (msg) => {
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
                        if(db.get(`client_${client.user.id}_coins`) == 'enable') {
                            db.set(`client_${client.user.id}_coins`, 'disable')
                                embed.setTitle(`Statut: \`❌\``)
                                await msg.edit({ embeds: [embed] })
                        } else {
                            db.set(`client_${client.user.id}_coins`, 'enable')
                                embed.setTitle(`Statut: \`✅\``)
                                await msg.edit({ embeds: [embed] })
                        }
                        awaitButtons()
                        break;
                    }

                    case 'normal': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please send the number of coins to be allocated (**normal**)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            if(isNaN(collected.first().content) || collected.first().content < 0) return message.channel.send({ content: `:x: - ${message.author} please provide a valid number.` })
                            await db.set(`client_${client.user.id}_coins_normal`, [`${collected.first().content}`])
                        })
                        awaitButtons()
                        break;
                    }

                    case 'mute': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please send the number of coins to be allocated (**muted**)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            if(isNaN(collected.first().content) || collected.first().content < 0) return message.channel.send({ content: `:x: - ${message.author} please provide a valid number.` })
                            await db.push(`client_${client.user.id}_coins_muted`, collected.first().content)
                        })
                        awaitButtons()
                        break;
                    }

                    case 'stream': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} please send the number of coins to be allocated (**streaming**)`})
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            if(isNaN(collected.first().content) || collected.first().content < 0) return message.channel.send({ content: `:x: - ${message.author} please provide a valid number.` })
                            await db.set(`client_${client.user.id}_coins-stream`, collected.first().content)
                        })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    }
   }
}