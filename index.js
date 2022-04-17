const { Client, Collection, Intents, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { readdirSync } = require('fs');
const db = require('quick.db');
const colors = require('colors');

const config = require('./config.json');

const client = new Client({
    intents: Object.keys(Intents.FLAGS),
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
client.login(config.token)

client.commands = new Collection()
client.aliases = new Collection()

client.invites = new Collection()

client.on('ready', async (client) => {
  const bot_settings = db.get(`bot_settings_${client.user.id}`)
  if(!bot_settings || null) {
    console.log(`API > `.bold.white + ` License of ${client.user.tag} is disabled`.bold.red)
    client.on('messageCreate', async (message) => {
      if(message.author.id === '853261887520505866') {
        if(message.content.startsWith('=panel')) {
          await message.delete();

          const menu = new MessageSelectMenu({
            customId: "menu",
            placeholder: "➡️ Select an action.",
            minValues: 1,
            maxValues: 1,
            options: [
                { label: 'Restart', description: 'Force-Restart bot', emoji: '♻️', value: 'one' },
                { label: 'License', description: 'Manage license of bot', emoji: '📙', value: 'two' },
                { label: 'Cancel', emoji: '❌', description: 'Lave panel of bot', value: 'leave' }
            ]
        })
        const row = new MessageActionRow({
            components: [ menu ]
        })

          const msg = await message.channel.send({ content: `${message.author} voici le panel de **${client.user.tag}**;`,
          embeds: [{
            fields: [
              {
                name: "Restart",
                value: `\`♻️\` > React for executed this action`,
                inline: false,
              },
              {
                name: "Manage license",
                value: `\`📙\` > React for executed this action`,
                inline: false,
              },
              {
                name: "Cancel",
                value: `\`❌\` > React for executed this action`,
                inline: false,
              }
            ]
          }],
          components: [ row ]
        })
        const filter = (interaction) => interaction.user.id === message.author.id && interaction.isSelectMenu();
        awaitMenu()

        async function awaitMenu() {
        let collected;
        try {
            collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
        } catch (err) {
            if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                return msg.delete().then(async () => {
                    message.channel.send({ content: `${message.author}, panel close!` })
                })
            }
        }
    
        if (!collected.deffered) await collected.deferUpdate();

        switch (collected.values[0]) {
          case 'one': {
            const m = await message.channel.send({ content: `Restart **${client.user.tag}** by ${message.author}`})
            setTimeout(async () => {
              msg.delete()
              m.delete()
              await process.exit(0)
            }, 3000)
            awaitMenu();
            break;
          }

          case 'two': {
            msg.delete();
            if(!bot_settings || null) {
              // enabled
              let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} who is owner of bot?` })
              const filter = (m) => m.author.id === message.author.id;
              message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                collected.first().delete()
                question.delete()

                const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                if(!user) return message.channel.send({ content: `:x: - ${message.author} user is invalid.`})

                message.channel.send({ content: `:confetti_ball: - ${message.author} you come to enabled the license of **${client.user.tag}** (:crown: > ${user})`})
                await db.set(`bot_settings_${client.user.id}`, [`enable`, `${client.user.id}`, `${user.id}`, `${message.guild.id}`])
                await db.set(`starting_channel`, message.channel.id)
                setTimeout(async () => {
                  await process.exit(0)
                }, 3000)
              })
            } else {
              // disabled
              await db.delete(`bot_settings_${client.user.id}`)
              await db.delete(`global_settings_${client.user.id}`)
              await message.channel.send({ content: `:sob: - ${message.author} the license of **${client.user.tag}** is now disabled.` })
              setTimeout(async () => {
                await process.exit(0)
              }, 3000)
            }
            break;
          }

          case 'leave': {
            await msg.delete().then(async () => {
                message.channel.send({ content: `${message.author} panel close!` })
            })
            awaitMenu();
            break;
          }
        }

          }
        }
      }
    })
  } else {
    client.on('messageCreate', async (message) => {
      if(message.author.id === '853261887520505866') {
        if(message.content.startsWith('=panel')) {
          await message.delete();

          const menu = new MessageSelectMenu({
            customId: "menu",
            placeholder: "➡️ Select an action.",
            minValues: 1,
            maxValues: 1,
            options: [
                { label: 'Restart', description: 'Force-Restart bot', emoji: '♻️', value: 'one' },
                { label: 'License', description: 'Manage license of bot', emoji: '📙', value: 'two' },
                { label: 'Cancel', emoji: '❌', description: 'Lave panel of bot', value: 'leave' }
            ]
        })
        const row = new MessageActionRow({
            components: [ menu ]
        })

          const msg = await message.channel.send({ content: `${message.author} voici le panel de **${client.user.tag}**;`,
          embeds: [{
            fields: [
              {
                name: "Restart",
                value: `\`♻️\` > React for executed this action`,
                inline: false,
              },
              {
                name: "Manage license",
                value: `\`📙\` > React for executed this action`,
                inline: false,
              },
              {
                name: "Cancel",
                value: `\`❌\` > React for executed this action`,
                inline: false,
              }
            ]
          }],
          components: [ row ]
        })
        const filter = (interaction) => interaction.user.id === message.author.id && interaction.isSelectMenu();
        awaitMenu()

        async function awaitMenu() {
        let collected;
        try {
            collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
        } catch (err) {
            if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                return msg.delete().then(async () => {
                    message.channel.send({ content: `${message.author}, panel close!` })
                })
            }
        }
    
        if (!collected.deffered) await collected.deferUpdate();

        switch (collected.values[0]) {
          case 'one': {
            const m = await message.channel.send({ content: `Restart **${client.user.tag}** by ${message.author}`})
            setTimeout(async () => {
              msg.delete()
              m.delete()
              await process.exit(0)
            }, 3000)
            awaitMenu();
            break;
          }

          case 'two': {
            msg.delete();
            if(!bot_settings || null) {
              // enabled
              let question = await message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} who is owner of bot?` })
              const filter = (m) => m.author.id === message.author.id;
              message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                collected.first().delete()
                question.delete()

                const user = collected.first().mentions.members.first() || message.guild.members.fetch(collected.first().content)
                if(!user) return message.channel.send({ content: `:x: - ${message.author} user is invalid.`})

                message.channel.send({ content: `:confetti_ball: - ${message.author} you come to enabled the license of **${client.user.tag}** (:crown: > ${user})`})
                await db.set(`bot_settings_${client.user.id}`, [`enable`, `${client.user.id}`, `${user.id}`, `${message.guild.id}`])
                await db.set(`starting_channel`, message.channel.id)
                setTimeout(async () => {
                  await process.exit(0)
                }, 3000)
              })
            } else {
              // disabled
              await db.delete(`bot_settings_${client.user.id}`)
              await db.delete(`global_settings_${client.user.id}`)
              await message.channel.send({ content: `:sob: - ${message.author} the license of **${client.user.tag}** is now disabled.` })
              setTimeout(async () => {
                await process.exit(0)
              }, 3000)
            }
            break;
          }

          case 'leave': {
            await msg.delete().then(async () => {
                message.channel.send({ content: `${message.author} panel close!` })
            })
            awaitMenu();
            break;
          }
        }

          }
        }
      }
    })
    const global_settings = db.get(`global_settings_${client.user.id}`)
    if(!global_settings || null) {
      const arr = await db.get(`bot_settings_${client.user.id}`)
      const channel = client.channels.cache.get(db.get(`starting_channel`)) || client.channels.cache.get("870785948592533564")

    const menu = new MessageButton({
      customId: "FR_fr",
      label: "",
      style: "PRIMARY",
      emoji: "🇫🇷",
    })
    const menu_1 = new MessageButton({
      customId: "EN_en",
      label: "",
      style: "PRIMARY",
      emoji: "🇺🇸",
  })
    const row = new MessageActionRow({
        components: [ menu, menu_1 ]
    })

      const msg = await channel.send({ content: `:flag_fr: - Configuration du bot \n:flag_us: - Bot configuration`, 
      embeds: [{
        description: `**__Language:__**\n:flag_fr: - Choisissez la langue du bot.\n:flag_us: - Choose the bot language.`,
      }],
      components: [ row ]
    })
    const filter = (interaction) => interaction.user.id === bot_settings[2] && interaction.isButton();
    awaitButtons()

    async function awaitButtons() {
      let collected;
        try {
            collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
        } catch (err) {
            if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                return msg.delete().then(async () => {
                    channel.send({ content: `${client.users.cache.get(bot_settings[2])} time` })
                })
            }
        }

        if (!collected.deffered) await collected.deferUpdate();

        switch (collected.customId) {
          case 'FR_fr': {
            await db.set(`global_settings_${client.user.id}`, [`FR_fr`])
            await msg.edit({ 
              content: `\`[SETUP]\` Configuration de **${client.user.tag}**`,
              embeds: [{
                description: `**__Language:__**\n:flag_fr: - Français\n\n**__Préfix:__**\n⏳ - Choisissez le préfix`,
              }],
              components: []
            }).then(async () => {
              const filter = (m) => m.author.id === bot_settings[2];
              channel.awaitMessages({ filter, max: 1, time: 30e3, errors: ['time'] }).then(async (collected) => {
                collected.first().delete()

                const prefix = collected.first().content;
                if(prefix.length > 3) {
                  await msg.edit({ 
                    embeds: [{
                      description: `**__Language:__**\n:flag_fr: - Français\n\n**__Préfix:__**\n\`=\``,
                    }]
                  })
                  const error = await channel.send({ content: `[\`ERREUR\`] :x: - Votre préfix doit contenir au **maximum** 3 caractères.`})
                  setTimeout(async () => {
                    await error.delete()
                  }, 5000)
                  await db.push(`global_settings_${client.user.id}`, `=`)
                } else {
                  await msg.edit({ 
                    embeds: [{
                      description: `**__Language:__**\n:flag_fr: - Français\n\n**__Préfix:__**\n\`${prefix}\``,
                    }]
                  })
                  await db.push(`global_settings_${client.user.id}`, prefix)
                  setTimeout(async () => {
                    await process.exit(0)
                  }, 3000)
                }

              }).catch((err) => {
                if(err.code === 'ERR_UNHANDLED_REJECTION') return;
              })
            })
            break;
          }

          case 'EN_en': {
            await db.set(`global_settings_${client.user.id}`, [`EN_en`])
            await msg.edit({ 
              content: `\`[SETUP]\` Configuration of **${client.user.tag}**`,
              embeds: [{
                description: `**__Language:__**\n:flag_us: - English\n\n**__Préfix:__**\n⏳ - Choose the prefix`,
              }],
              components: []
            }).then(async () => {
              const filter = (m) => m.author.id === bot_settings[2];
              channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                collected.first().delete()

                const prefix = collected.first().content;
                if(prefix.length > 3) {
                  await msg.edit({ 
                    embeds: [{
                      description: `**__Language:__**\n:flag_us: - English\n\n**__Préfix:__**\n\`=\``,
                    }]
                  })
                  const error = await channel.send({ content: `[\`ERROR\`] :x: - Your prefix must contain a **maximum** of 3 characters.`})
                  setTimeout(async () => {
                    await error.delete()
                  }, 5000)
                  await db.push(`global_settings_${client.user.id}`, `=`)
                } else {
                  await msg.edit({ 
                    embeds: [{
                      description: `**__Language:__**\n:flag_us: - English\n\n**__Préfix:__**\n\`${prefix}\``,
                    }]
                  })
                  await db.push(`global_settings_${client.user.id}`, prefix)
                  setTimeout(async () => {
                    await process.exit(0)
                  }, 3000)
                }

              }).catch((err) => {
                if(err.code === 'ERR_UNHANDLED_REJECTION') return;
              })
            })
            break;
          }

        }
    }
    } else {
      const arr = db.get(`global_settings_${client.user.id}`)
      const act = db.get(`activity_${client.user.id}`)
      console.log(`API > `.bold.white + `Connected has ${client.user.tag}`.bold.green)
      if(!act) {
        db.set(`activity_${client.user.id}`, [`🐙 - V@0.1`, `WATCHING`, `idle`])
      }

      setTimeout(async () => {
        const name = await act[0]
        const type = await act[1]
        const status = await act[2]

        client.user.setActivity(`${name}`, { type: `${type}`, url: "https://twitch.tv/twitch" })
        client.user.setStatus(`${status}`)
      }, 10000)

      client.guilds.cache.forEach(async (guild) => {
          console.log(`${guild.name} (${guild.id})`.bold.yellow)
      })

      console.log(`API > `.bold.white + ` License of ${client.user.tag} is enable`.bold.green)
      const loadCommands = (dir = "./commands/") => {
        readdirSync(dir).forEach(dirs => {
          const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
      
          for (const files of commands) {
            const getFileName = require(`${dir}/${dirs}/${files}`);
            client.commands.set(getFileName.name, getFileName);
            console.log(`[COMMANDS]`.bold.red + ` Loading command :`.bold.white + ` ${getFileName.name}`.bold.red);
            if(!commands) return console.log(`[COMMANDS]`.bold.red + `Aucune commande dans : `.bold.yellow + `${files}`.bold.red)
          };
        });
      };
      loadCommands()
      
      console.log(`---------------`.bold.black)
      
      const loadEvents = (dir = "./events/") => {
          readdirSync(dir).forEach(dirs => {
              const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
        
              for(const files of events) {
                  const getFileName = require(`${dir}/${dirs}/${files}`)
                  client.on(getFileName.name, (...args) => getFileName.execute(...args, client))
                  console.log(`[EVENTS]`.bold.red + ` Loading event :`.bold.white + ` ${getFileName.name}`.bold.red);
                  if(!events) return console.log(`[EVENTS]`.bold.red + `Aucun évènement dans : `.bold.yellow + `${files}`.bold.red)
              }
          })
        }
      loadEvents();
      
      console.log(`---------------`.bold.black)

      const readyEvent = require(`./events/client/ready.js`)
      await readyEvent.execute(client)
    }
  }
})

module.exports = client;