const { Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Canvas = require('canvas');
const db = require('quick.db')

module.exports = {
    name: "set-captcha",
    aliases: ['setup-captcha'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    const settings = db.get(`captcha_settings_${client.user.id}`)

    if(!settings) {
        db.set(`captcha_settings_${client.user.id}`, ['disable', 'x', 'x'])
    }

    if(settings[2]) {
        role = message.guild.roles.cache.get(settings[2])
    } else {
        role = 'Aucun rôle'
    }

    const button = new MessageButton({
        customId: "click",
        label: "",
        style: "SECONDARY",
        emoji: "🔘",
      })
      const button_1 = new MessageButton({
        customId: "edit",
        label: "",
        style: "SECONDARY",
        emoji: "✏️",
      })
      const row = new MessageActionRow({
        components: [ button, button_1 ]
    })

    if(settings[0] == 'enable') {
        statut = '✅'
    } else {
        statut = '❌'
    }

    if(arr[0] == 'FR_fr') {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`})

        message.channel.send({
            embeds: [{
                color: '#f71b2e',
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Activer/Désactiver le système de captcha**\n\`✏️\` **Editer le rôle d'arrivé**\n> ${role}`,
                author: {
                    name: `${message.author.tag}`,
                    icon_url: `${message.author.avatarURL()}`,
                },
            }],
            components: [ row ]
        }).then(async (msg) => {
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
                        if(settings[0] == 'enable') {
                            settings[0] = 'disable'
                            settings[1] = 'x'
                            db.set(`captcha_settings_${client.user.id}`, settings)
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`❌\``,
                                        description: `\`🔘\` **Activer/Désactiver le système de captcha**\n\`✏️\` **Editer  le rôle d'arrivé**\n> ${role}`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        },  
                                    }],
                                    components: [ row ]
                                })
                                if(client.channels.cache.get(settings[1])) {
                                    const ch = client.channels.cache.get(settings[1])
                                    await ch.delete()

                                    const filtered = settings.filter(id => id !== ch.id);
                                    db.set(`captcha_settings_${client.user.id}`, filtered)
                                }
                        } else {
                            if(!settings) {
                                db.set(`captcha_settings_${client.user.id}`, ['enable'])
                                await msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Activer/Désactiver le système de captcha**\n\`✏️\` **Editer le rôle d'arrivé**\n> ${role}`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        },  
                                    }],
                                    components: [ row ]
                                })
                                await message.guild.channels.create(`verification`, {
                                    type: "GUILD_TEXT",
                                }).then(async (c) => {
                                    db.push(`captcha_settings_${client.user.id}`, c.id)
                                })
                            } else {
                                settings[0] = 'enable'
                                db.set(`captcha_settings_${client.user.id}`, settings)
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Activer/Désactiver le système de captcha**\n\`✏️\` **Editer le rôle d'arrivé**\n> ${role}`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        },  
                                    }],
                                    components: [ row ]
                                })
                                await message.guild.channels.create(`verification`, {
                                    type: "GUILD_TEXT",
                                }).then(async (c) => {
                                    settings[1] = `${c.id}`
                                    db.set(`captcha_settings_${client.user.id}`, settings)
                                })
                            }
                        }
                        awaitButtons()
                        break;
                    }

                    case 'edit': {
                        msg.edit({
                            embeds: [{
                                color: '#f71b2e',
                                title: `Statut: \`✅\``,
                                description: `\`🔘\` **Activer/Désactiver le système de captcha**\n\`✏️\` **Editer le rôle d'arrivé**\n> Veuillez mentionner ou fournir l'identifiant du rôle.`,
                                author: {
                                    name: `${message.author.tag}`,
                                    icon_url: `${message.author.avatarURL()}`,
                                },  
                            }],
                            components: [ row ]
                        }).then(async (msg) => {
                            const filter = (m) => m.author.id === message.author.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()

                            const role = collected.first().mentions.roles.first() || message.guild.roles.get(collected.first().content)
                            db.push(`captcha_settings_${client.user.id}`, role.id)

                            msg.edit({
                                embeds: [{
                                    color: '#f71b2e',
                                    title: `Statut: \`✅\``,
                                    description: `\`🔘\` **Activer/Désactiver le système de captcha**\n\`✏️\` **Editer le rôle d'arrivé**\n> ${role}.`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },  
                                }],
                                components: [ row ]
                            })
                            })
                        })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    } else {
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.channel.send({ content: `:x: - ${message.author} you do not have permission to use this command.`})

        message.channel.send({
            embeds: [{
                color: '#f71b2e',
                title: `Statut: \`${statut}\``,
                description: `\`🔘\` **Enable/Disable captcha system**\n\`✏️\` **Edit welcome role**\n> ${role}`,
                author: {
                    name: `${message.author.tag}`,
                    icon_url: `${message.author.avatarURL()}`,
                },
            }],
            components: [ row ]
        }).then(async (msg) => {
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
                        if(settings[0] == 'enable') {
                            settings[0] = 'disable'
                            settings[1] = 'x'
                            db.set(`captcha_settings_${client.user.id}`, settings)
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`❌\``,
                                        description: `\`🔘\` **Enable/Disable captcha system**\n\`✏️\` **Edit welcome role**\n> ${role}`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        },
                                    }],
                                    components: [ row ]
                                })
                                if(client.channels.cache.get(settings[1])) {
                                    const ch = client.channels.cache.get(settings[1])
                                    await ch.delete()

                                    const filtered = settings.filter(id => id !== ch.id);
                                    db.set(`captcha_settings_${client.user.id}`, filtered)
                                }
                        } else {
                            if(!settings) {
                                db.set(`captcha_settings_${client.user.id}`, ['enable'])
                                await msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Enable/Disable captcha system**\n\`✏️\` **Edit welcome role**\n> ${role}`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        },
                                    }],
                                    components: [ row ]
                                })
                                await message.guild.channels.create(`verification`, {
                                    type: "GUILD_TEXT",
                                }).then(async (c) => {
                                    db.push(`captcha_settings_${client.user.id}`, c.id)
                                })
                            } else {
                                settings[0] = 'enable'
                                db.set(`captcha_settings_${client.user.id}`, settings)
                                msg.edit({
                                    embeds: [{
                                        color: '#f71b2e',
                                        title: `Statut: \`✅\``,
                                        description: `\`🔘\` **Enable/Disable captcha system**\n\`✏️\` **Edit welcome role**\n> ${role}`,
                                        author: {
                                            name: `${message.author.tag}`,
                                            icon_url: `${message.author.avatarURL()}`,
                                        },
                                    }],
                                    components: [ row ]
                                })
                                await message.guild.channels.create(`verification`, {
                                    type: "GUILD_TEXT",
                                }).then(async (c) => {
                                    settings[1] = `${c.id}`
                                    db.set(`captcha_settings_${client.user.id}`, settings)
                                })
                            }
                        }
                        awaitButtons()
                        break;
                    }

                    case 'edit': {
                        msg.edit({
                            embeds: [{
                                color: '#f71b2e',
                                title: `Statut: \`✅\``,
                                description: `\`🔘\` **Enable/Disable captcha system**\n\`✏️\` **Edit welcome role**\n> Please mention or provide ID of role`,
                                author: {
                                    name: `${message.author.tag}`,
                                    icon_url: `${message.author.avatarURL()}`,
                                },
                            }],
                            components: [ row ]
                        }).then(async (msg) => {
                            const filter = (m) => m.author.id === message.author.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete()

                            const role = collected.first().mentions.roles.first() || message.guild.roles.get(collected.first().content)
                            db.push(`captcha_settings_${client.user.id}`, role.id)

                            msg.edit({
                                embeds: [{
                                    color: '#f71b2e',
                                    title: `Statut: \`✅\``,
                                    description: `\`🔘\` **Enable/Disable captcha system**\n\`✏️\` **Edit welcome role**\n> ${role}`,
                                    author: {
                                        name: `${message.author.tag}`,
                                        icon_url: `${message.author.avatarURL()}`,
                                    },
                                }],
                                components: [ row ]
                            })
                            })
                        })
                        awaitButtons()
                        break;
                    }
                }
            }
        })
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 7; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
      
      const canvas = Canvas.createCanvas(700, 250);
      const context = canvas.getContext('2d');

      const background = await Canvas.loadImage('./addons/wallpapers/bg6.png');

      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.strokeStyle = '#0099ff';
      context.strokeRect(0, 0, canvas.width, canvas.height);

      context.font = '80px Comic Sans';
      context.fillStyle = '#3d3d3d';

      const text = makeid()

      const x = canvas.width / 2;
      const align = ["left", "right", "center", "start", "end"]
      const textAlign = align[Math.floor(align.length * Math.random())]
      context.textAlign = textAlign
      context.fillText(`${text}`, x, 85);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'captcha.png');

      message.channel.send({
        content: `${message.author} veuillez saisir le captcha sur l'image ci-dessous pour avoir accès au serveur.`,
        files: [ attachment ]
      }).then(async (msg) => {
          const filter = (m) => m.author.id === message.author.id;
          message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
              collected.first().delete()
              msg.delete()

              const captchaPin = collected.first().content
              if(captchaPin == `${text}`) {
                  console.log('accept')
              } else {
                  console.log('kick')
              }
          }).catch(async (err) => {
              if(err.code == 'ERR_UNHANDLED_REJECTION') return console.log('kick')
          })
      })

    }
}