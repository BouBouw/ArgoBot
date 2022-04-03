const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "invite",
    aliases: ['invites'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const member = message.mentions.members.first() || message.author;

    let number = 0;

    switch(arr[0]) {
        case 'FR_fr': {
            const firstInvites = await message.guild.invites.fetch();
            firstInvites.map(async (invite) => {
                if(invite.inviter.id === member.user.id) {
                    number = Math.round(number + invite.uses);
                }
            })

            await message.channel.send({
                embeds: [{
                    color: `#326e2f`,
                    title: `Invitations de ${member.user.tag}`,
                    fields: [
                        {
                            name: `↬ Invites:`,
                            value: `> \`${number}\` utilisations.`
                        }
                    ]
                }]
            })
            break;
        }

        case 'EN_en': {
            const firstInvites = await message.guild.invites.fetch();
            firstInvites.map(async (invite) => {
                if(invite.inviter.id === member.user.id) {
                    number = Math.round(number + invite.uses);
                }
            })

            await message.channel.send({
                embeds: [{
                    color: `#326e2f`,
                    title: `Invitation of ${member.user.tag}`,
                    fields: [
                        {
                            name: `↬ Invite:`,
                            value: `> \`${number}\` uses.`
                        }
                    ]
                }]
            })
            break;
        }

    }
    }
}