const { MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "panel",
    aliases: ['dev'],
    description: "",
execute: async (client, message, args) => {
  if(message.author.id === '853261887520505866') {

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
}