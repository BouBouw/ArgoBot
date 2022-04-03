const { MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Canvas = require('canvas');
const db = require('quick.db');

module.exports = {
    name: "level",
    aliases: ['rank'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    let initialExp = 500;

    let expUser = db.get(`guild_${message.guild.id}_exp_${message.author.id}`)
    let rankUser = db.get(`guild_${message.guild.id}_rank_${message.author.id}`)

    let nextLevelExp = initialExp * (Math.pow(2, rankUser) - 1);

    if(arr[0] === 'FR_fr') {
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        await xpBar();

        async function xpBar() {
            let pourcent = expUser / nextLevelExp;
            let progress = Math.round((10 * pourcent));
            let emptyProgess = 10 - progress;

            let progressText = '■'.repeat(progress)
            let emptyProgessText = '□'.repeat(emptyProgess)
            let pourcentText = Math.round(pourcent * 100) + "%"
            let bar =  `|${progressText}${emptyProgessText}| ${pourcentText}`

            const background = await Canvas.loadImage(`https://bbdnitm.ac.in/wp-content/uploads/2020/04/banner-background-4.jpg`);

            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));

            context.font = '35px sans-serif';

            //context.strokeStyle = '#0020a1';
            //context.strokeRect(115, 189, 500, 60);

            let colorText = '#ffff';
            if(Math.round(pourcent * 100) >= 75) {
                colorText = '#014a18'
            } else if(Math.round(pourcent * 100) >= 50) {
                colorText = '#03ad39'
            } else if(Math.round(pourcent * 100) >= 25) {
                colorText = '#ff9d00'
            } else {
                colorText = '#cf3000'
            }
            context.fillStyle = `${colorText}`;
            context.fillText(`${bar}`, canvas.width / 4.5, canvas.height / 1.1);

            context.beginPath();
            context.arc(75, 75, 50, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            let imagePlace = await Canvas.loadImage('https://imgur.com/3RKOLw2.png');
            /*if() {

            } else if() {

            } else if() {

            }*/

            //context.drawImage(imagePlace, 100, 100, 50, 50)
            context.drawImage(avatar, 15, 15, 125, 125);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'ranked.png');

            await message.channel.send({
                content: `${message.author}`,
                embeds: [{
                    color: `#f5f540`,
                    description: `\`⭐\` Rank: \`${rankUser}\`\nManquant **${Math.round(nextLevelExp - expUser)}** pour passer niveau ${Math.round(rankUser + 1)}`,
                    fields: [
                        {
                            name: `Expériences`,
                            value: `${expUser} XP.`,
                            inline: true,
                        },
                        {
                            name: `Objectif`,
                            value: `${nextLevelExp} XP.`,
                            inline: true
                        }
                    ],
                    image: {
                        url: `attachment://ranked.png`
                    }
                }],
                files: [ attachment ],
            })
        }
    } else {
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        await xpBar();

        async function xpBar() {
            let pourcent = expUser / nextLevelExp;
            let progress = Math.round((10 * pourcent));
            let emptyProgess = 10 - progress;

            let progressText = '▇'.repeat(progress)
            let emptyProgessText = '—'.repeat(emptyProgess)
            let pourcentText = Math.round(pourcent * 100) + "%"
            let bar =  `|${progressText}${emptyProgessText}| ${pourcentText}`

            const background = await Canvas.loadImage(`https://bbdnitm.ac.in/wp-content/uploads/2020/04/banner-background-4.jpg`);

            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));

            context.font = '35px sans-serif';

            //context.strokeStyle = '#0020a1';
            //context.strokeRect(115, 189, 500, 60);

            let colorText = '#ffff';
            if(Math.round(pourcent * 100) >= 75) {
                colorText = '#014a18'
            } else if(Math.round(pourcent * 100) >= 50) {
                colorText = '#03ad39'
            } else if(Math.round(pourcent * 100) >= 25) {
                colorText = '#ff9d00'
            } else {
                colorText = '#cf3000'
            }
            context.fillStyle = `${colorText}`;
            context.fillText(`${bar}`, canvas.width / 4.5, canvas.height / 1.1);

            context.beginPath();
            context.arc(75, 75, 50, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            context.drawImage(avatar, 15, 15, 125, 125);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'ranked.png');

            await message.channel.send({
                content: `${message.author}`,
                embeds: [{
                    color: `#f5f540`,
                    description: `\`⭐\` Rank: \`${rankUser}\`\nMissing **${Math.round(nextLevelExp - expUser)}** for level up rank ${Math.round(rankUser + 1)}`,
                    fields: [
                        {
                            name: `Experiences`,
                            value: `${expUser} XP.`,
                            inline: true,
                        },
                        {
                            name: `Objectif`,
                            value: `${nextLevelExp} XP.`,
                            inline: true
                        }
                    ],
                    image: {
                        url: `attachment://ranked.png`
                    }
                }],
                files: [ attachment ],
            })
        }
    }

    }
}