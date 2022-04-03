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

    // Pattern: ['anti-channels', 'anti-roles', 'anti-spam', 'anti-links', 'anti-webhooks', 'anti-joins', 'anti-bots']

    // Commands List
        const owners = "`settings`, `recup`, `transfer`, `ownerlist`, `whitelist`, `blacklist`"
        const admin = "`configuration`, `setup-modmail`, `setup-coins`, `setup-logs`, `setup-voices`, `setup-welcome`, `setup-captcha`, `setup-leave`, `emoji`, `setup-counters`, `setup-presence`"
        const mod = "`clear`, `kick`, `ban`, `unban`, `mute`, `tempmute`, `unmute`, `mutelist`, `voicemove`, `voicekick`, `voicestats`, `renew`"
        const misc = "`help`, `ping`, `avatar`, `say`, `embed`, `speed`, `weather`, `snipe`, `cryptocurrency`, `server-infos`, `roles-infos`, `channel-infos`, `invites`"
        const protect = "`anti-channels`, `anti-roles`, `anti-spam`, `anti-links`, `anti-webhooks`, `anti-joins`, `anti-bots`, `anti-updates`"
        const eco = "`manage-coins`, `profil`, `level`, `balance`, `leaderboard`, `daily`, `slot`, `roulette`"
        const give = "`giveaway`"
        const nsfw = "`ass`, `pussy`, `boobs`, `hentai`, `squirt`, `anal`, `porngif`"

    const menu = new MessageButton({
        customId: "left",
        label: "",
        style: "SECONDARY",
        emoji: "⬅️",
      })
      const menu_1 = new MessageButton({
        customId: "right",
        label: "",
        style: "SECONDARY",
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
                        page = 7;
                        embed.setTitle(`:underage: NSFW`)
                        embed.setColor('#40b0f5')
                        embed.setDescription(nsfw)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('#000000')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('#f71b2e')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('#ffffff')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('#326e2f')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('#c48206')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('#f5f540')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 6) {
                        embed.setTitle(`:tada: Giveaway`)
                        embed.setColor('#6f21ff')
                        embed.setDescription(give)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 7) {
                        embed.setTitle(`:underage: NSFW`)
                        embed.setColor('#40b0f5')
                        embed.setDescription(nsfw)
                        msg.edit({ embeds: [ embed ] })
                    }

                    awaitButtons();
                    break;
                }

                case 'right': {
                    page = page + 1;

                    if(page > 7) {
                        page = 0;
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('#000000')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('#000000')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('#f71b2e')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('#ffffff')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('#326e2f')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('#c48206')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('#f5f540')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 6) {
                        embed.setTitle(`:tada: Giveaway`)
                        embed.setColor('#6f21ff')
                        embed.setDescription(give)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 7) {
                        embed.setTitle(`:underage: NSFW`)
                        embed.setColor('#40b0f5')
                        embed.setDescription(nsfw)
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
        embed.setColor('#000000')
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
                        page = 7;
                        embed.setTitle(`:underage: NSFW`)
                        embed.setColor('#40b0f5')
                        embed.setDescription(nsfw)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('#000000')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('#f71b2e')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('#ffffff')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('#326e2f')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('#c48206')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('#f5f540')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 6) {
                        embed.setTitle(`:tada: Giveaway`)
                        embed.setColor('#6f21ff')
                        embed.setDescription(give)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 7) {
                        embed.setTitle(`:underage: NSFW`)
                        embed.setColor('#40b0f5')
                        embed.setDescription(nsfw)
                        msg.edit({ embeds: [ embed ] })
                    }

                    awaitButtons();
                    break;
                }

                case 'right': {
                    page = page + 1;

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('#000000')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 0) {
                        embed.setTitle(`:crown: Owns`)
                        embed.setColor('#000000')
                        embed.setDescription(owners)
                        msg.edit({ embeds: [ embed ] }) 
                    }

                    if(page == 1) {
                        embed.setTitle(`:pushpin: Admin`)
                        embed.setColor('#f71b2e')
                        embed.setDescription(admin)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 2) {
                        embed.setTitle(`:wrench: Mod`)
                        embed.setColor('#ffffff')
                        embed.setDescription(mod)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 3) {
                        embed.setTitle(`:bulb: Misc`)
                        embed.setColor('#326e2f')
                        embed.setDescription(misc)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 4) {
                        embed.setTitle(`:bell: Protect`)
                        embed.setColor('#c48206')
                        embed.setDescription(protect)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 5) {
                        embed.setTitle(`:coin: Coins`)
                        embed.setColor('#f5f540')
                        embed.setDescription(eco)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 6) {
                        embed.setTitle(`:tada: Giveaway`)
                        embed.setColor('#6f21ff')
                        embed.setDescription(give)
                        msg.edit({ embeds: [ embed ] })
                    }

                    if(page == 7) {
                        embed.setTitle(`:underage: NSFW`)
                        embed.setColor('#40b0f5')
                        embed.setDescription(nsfw)
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