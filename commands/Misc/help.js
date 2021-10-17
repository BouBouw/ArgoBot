const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "help",
    aliases: ['commands'],
    description: "",
execute: async (client, message, args) => {
    let page = 0;
    const embed = new MessageEmbed()

    const arr = db.get(`global_settings_${client.user.id}`)

    // Commands List
        const owners = "`settings`, `recup`, `ownerlist`, `whitelist`, `blacklist`"
        const admin = "`configuration`, `setup-coins`, `setup-logs`, `setup-voices`, `emoji`"
        const mod = "`clear`, `kick`, `ban`, `unban`, `mute`, `tempmute`, `unmute`, `mutelist`, `voicemove`, `voicekick`, `voicestats`, `renew`"
        const misc = "`help`, `ping`, `avatar`, `say`, `embed`, `speed`"
        const protect = "`anti-bots`, `anti-join`, `anti-links`, `anti-spam`, `anti-webhooks`"
        const eco = "`x`"
        const give = "`giveaway`"

    const menu = new MessageButton({
        customId: "left",
        label: "",
        style: "PRIMARY",
        emoji: "⬅️",
      })
      const menu_1 = new MessageButton({
        customId: "right",
        label: "",
        style: "PRIMARY",
        emoji: "➡️",
    })
      const row = new MessageActionRow({
          components: [ menu, menu_1 ]
      })

    if(arr[0] === 'FR_fr') {
        embed.setTitle(`:crown: Owns`)
        embed.setColor('BLACK')
        embed.setDescription(owners)
        embed.setTimestamp()
        embed.setFooter(client.user.username)
        await message.channel.send({ 
        content: `${message.author},`,
        embeds: [ embed ],
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
                case 'left': {
                    page = page - 1;
                    
                    if(page < 0) {
                        page = 6;
                        embed.setTitle(`:tada: Giveaway`)
                        embed.setColor('PURPLE')
                        embed.setDescription(give)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('BLACK')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('RED')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('WHITE')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('GREEN')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('ORANGE')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('YELLOW')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 6) {
                        embed.setTitle(`:tada: Giveaway`)
                        embed.setColor('PURPLE')
                        embed.setDescription(give)
                        msg.edit({ embeds: [ embed ] })
                    }

                    awaitButtons();
                    break;
                }

                case 'right': {
                    page = page + 1;

                    if(page > 6) {
                        page = 0;
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('BLACK')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('BLACK')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('RED')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('WHITE')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('GREEN')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('ORANGE')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('YELLOW')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 6) {
                        embed.setTitle(`:tada: Giveaway`)
                        embed.setColor('PURPLE')
                        embed.setDescription(give)
                        msg.edit({ embeds: [ embed ] })
                    }

                    awaitButtons();
                    break;
                }
            }
        }
    })

    } else {
        embed.setTitle(`:crown: Owns`)
        embed.setColor('BLACK')
        embed.setDescription(owners)
        embed.setTimestamp()
        embed.setFooter(client.user.username)
        await message.channel.send({ 
        content: `${message.author},`,
        embeds: [ embed ],
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
                case 'left': {
                    page = page - 1;
                    
                    if(page < 0) {
                        page = 5;
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('YELLOW')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('BLACK')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('RED')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('WHITE')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('GREEN')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('ORANGE')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('YELLOW')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    awaitButtons();
                    break;
                }

                case 'right': {
                    page = page + 1;

                    if(page > 5) {
                        page = 0;
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('BLACK')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('BLACK')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('RED')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('WHITE')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('GREEN')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('ORANGE')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('YELLOW')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    awaitButtons();
                    break;
                }
            }
        }
    })      
    }

    }
}