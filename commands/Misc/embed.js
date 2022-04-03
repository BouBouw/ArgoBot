const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "embed",
    aliases: ['embeds'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const embed = new MessageEmbed()

    const button = new MessageButton({
        customId: "author",
        label: "",
        style: "SECONDARY",
        emoji: "👤",
      })
    const button_1 = new MessageButton({
      customId: "title",
      label: "",
      style: "SECONDARY",
      emoji: "📌",
    })
    const button_2 = new MessageButton({
        customId: "url",
        label: "",
        style: "SECONDARY",
        emoji: "🌐",
      })
      const button_3 = new MessageButton({
        customId: "description",
        label: "",
        style: "SECONDARY",
        emoji: "📰",
      })
      const button_4 = new MessageButton({
        customId: "addField",
        label: "",
        style: "SECONDARY",
        emoji: "📝",
      })
      const button_5 = new MessageButton({
        customId: "image",
        label: "",
        style: "SECONDARY",
        emoji: "🖼️",
      })
      const button_6 = new MessageButton({
        customId: "footer",
        label: "",
        style: "SECONDARY",
        emoji: "🔻",
      })
      const button_7 = new MessageButton({
        customId: "colors",
        label: "",
        style: "SECONDARY",
        emoji: "🌈",
      })
      const button_8 = new MessageButton({
        customId: "send",
        label: "",
        style: "SUCCESS",
        emoji: "✅",
      })
      const button_9 = new MessageButton({
        customId: "cancel",
        label: "",
        style: "DANGER",
        emoji: "❌",
      })
      const row = new MessageActionRow({
          components: [ button, button_1, button_2, button_3 ]
      })
      const row_1 = new MessageActionRow({
        components: [ button_4, button_5, button_6, button_7 ]
    })
    const row_2 = new MessageActionRow({
        components: [ button_8, button_9 ]
    })

    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})
        embed.setDescription(`:hourglass_flowing_sand: Création d'un embed ...`)
        message.channel.send({ embeds: [embed] }).then(async (emb) => {
        await message.channel.send({ content: `↳ 👤 - **Modifier l'auteur**\n↳ 📌 - **Modifier le titre**\n↳ 🌐 - **Ajouter un URL**\n↳ 📰 - **Modifier la description**\n↳ 📝 - **Ajouter une ligne**\n↳ 🖼️ - **Ajouter une image**\n↳ 🔻 - **Modifier le bas de page**\n↳ 🌈 - **Modifier la couleur**\n\n✅ - **Envoyer l'embed**\n❌ - **Annuler la création d'embed**`, components: [ row, row_1, row_2 ] }).then(async (msg) => {

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
                    case 'author': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel auteur voulez-vous attribuer a l'embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
        
                            embed.setAuthor(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'title': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel titre voulez-vous attribuer a l'embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                            
                            embed.setTitle(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'url': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel URL voulez-vous attribuer a l'embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                            if(!txt.startsWith('https://') || !txt.startsWith('http://') || !txt.content('www.')) return message.channel.send({ content: `:x: - ${message.author} lien invalide, opération annulée.`})
                            
                            embed.setURL(txt)
                            emb.edit({ embeds: [embed] })
                        })
                    }

                    case 'description': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quelle description voulez-vous attribuer a l'embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                        
                            embed.setDescription(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'addField': {
                        const filter = (m) => m.author.id === message.author.id;
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel texte de ligne (**Titre**) voulez-vous ajouter a l'embed` })
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            const txt = collected.first()
                            collected.first().delete().then(async (msg2) => {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel texte de ligne (**Description**) voulez-vous ajouter a l'embed` })
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    question.delete()
                                    collected.first().delete()
                                    const txt2 = collected.first().content
                                
                                    embed.addField(`${txt}`, `${txt2}`)
                                    emb.edit({ embeds: [embed] })
                                })
                            })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'image': {
                        const filter = (m) => m.author.id === message.author.id;
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quelle image voulez-vous ajouter a l'embed` })
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first()

                            if(collected.first().attachements.size > 0) {
                                await message.attachments.forEach((attachement) => {
                                    embed.setImage(`${attachement}`)
                                })
                            } else {
                                const txt = collected.first().content
                                if(!txt.endsWith('.jpg') && !txt.endsWith('.png') && !txt.endsWith('.gif')) return message.channel.send({ content: `:x: - ${message.author} lien invalide, opération annulée.`})
                                embed.setImage(`${txt}`)
                            }

                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons()
                        break;
                    }
                    
                    case 'footer': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel bas de page voulez-vous attribuer a l'embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                        
                            embed.setFooter(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'colors': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} quel couleur voulez-vous attribuer a l'embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content

                            if(txt.startsWith(`#`) && txt.startsWith(Number())) {
                                if(txt.startsWith(`#`)) {

                                    embed.setColor(`${txt}`)
                                emb.edit({ embeds: [embed] })
                                } else if(txt.startsWith(Number())) {
                                    embed.setColor(`#${txt}`)
                                    emb.edit({ embeds: [embed] })
                                }
                            } else {
                                const colorsWord = txt.toUpperCase()
                                embed.setColor(`${colorsWord}`)
                                emb.edit({ embeds: [embed] })
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'send': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} dans quel salon voulez-vous envoyer l'embed ?` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                            channel.send({ embeds: [embed] }).then(async () => {
                                await msg.delete()
                                await emb.delete()
                            })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'cancel': {
                        message.channel.send({ content: `:white_check_mark:  - ${message.author} la création de l'embed est annulée.` }).then(async (m) => {
                            await msg.delete()
                            await emb.delete()
                            setTimeout(async () => {
                                m.delete()
                            }, 3000)
                        })
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})
        embed.setDescription(`:hourglass_flowing_sand: Creation of an embed ...`)
        message.channel.send({ embeds: [embed] }).then(async (emb) => {
        await message.channel.send({ content: `↳ 👤 - **Edit author**\n↳ 📌 - **Edit title**\n↳ 🌐 - **Edit URL**\n↳ 📰 - **Edit description**\n↳ 📝 - **Add a line**\n↳ 🖼️ - **Add an image**\n↳ 🔻 - **Edit footer**\n↳ 🌈 - **Edit color**\n\n✅ - **Send embed**\n❌ - **Cancel embed creation**`, components: [ row, row_1, row_2 ] }).then(async (msg) => {

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
                    case 'author': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} which author do you want to attribute to the embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
        
                            embed.setAuthor(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'title': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what title do you want to give to the embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                            
                            embed.setTitle(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'url': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} which URL do you want to assign to the embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                            if(!txt.startsWith('https://') || !txt.startsWith('http://') || !txt.content('www.')) return message.channel.send({ content: `:x: - ${message.author} invalid link, operation cancelled.`})
                            
                            embed.setURL(txt)
                            emb.edit({ embeds: [embed] })
                        })
                    }

                    case 'description': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what description do you want to give to the embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                        
                            embed.setDescription(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'addField': {
                        const filter = (m) => m.author.id === message.author.id;
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what line text (**Title**) do you want to add to the embed` })
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete().then(async (msg2) => {
                                let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what line text (**Description**) do you want to add to the embed` })
                                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                    question.delete()
                                    collected.first().delete()
                                    const txt2 = collected.first().content
                                
                                    embed.addField(`${txt}`, `${txt2}`)
                                    emb.edit({ embeds: [embed] })
                                })
                            })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'image': {
                        const filter = (m) => m.author.id === message.author.id;
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what picture do you want to add to embed` })
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first()

                            if(collected.first().attachements.size > 0) {
                                await message.attachments.forEach((attachement) => {
                                    embed.setImage(`${attachement}`)
                                })
                            } else {
                                const txt = collected.first().content
                                if(!txt.endsWith('.jpg') && !txt.endsWith('.png') && !txt.endsWith('.gif')) return message.channel.send({ content: `:x: - ${message.author} lien invalide, opération annulée.`})
                                embed.setImage(`${txt}`)
                            }

                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons()
                        break;
                    }
                    
                    case 'footer': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what footer do you want to assign to the embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content
                        
                            embed.setFooter(txt)
                            emb.edit({ embeds: [embed] })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'colors': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} what color do you want to assign to the embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const txt = collected.first().content

                            if(txt.startsWith(`#`) && txt.startsWith(Number())) {
                                if(txt.startsWith(`#`)) {

                                    embed.setColor(`${txt}`)
                                emb.edit({ embeds: [embed] })
                                } else if(txt.startsWith(Number())) {
                                    embed.setColor(`#${txt}`)
                                    emb.edit({ embeds: [embed] })
                                }
                            } else {
                                const colorsWord = txt.toUpperCase()
                                embed.setColor(`${colorsWord}`)
                                emb.edit({ embeds: [embed] })
                            }
                        })
                        awaitButtons();
                        break;
                    }

                    case 'send': {
                        let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} in which channel do you want to send the embed` })
                        const filter = (m) => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            question.delete()
                            collected.first().delete()
                            const channel = message.guild.channels.cache.get(collected.first().content) || collected.first().mentions.channels.first()
                            channel.send({ embeds: [embed] }).then(async () => {
                                await msg.delete()
                                await emb.delete()
                            })
                        })
                        awaitButtons();
                        break;
                    }

                    case 'cancel': {
                        message.channel.send({ content: `:white_check_mark:  - ${message.author} the creation of the embed is canceled.` }).then(async (m) => {
                            await msg.delete()
                            await emb.delete()
                            setTimeout(async () => {
                                m.delete()
                            }, 3000)
                        })
                        awaitButtons();
                        break;
                    }
                }
            }
        })
    })
    }

    }
}