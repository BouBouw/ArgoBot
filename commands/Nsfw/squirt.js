const { MessageAttachment } = require('discord.js');
const db = require('quick.db');
const fetch = require("node-fetch");

module.exports = {
    name: "squirt",
    aliases: [''],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    switch(arr[0]) {
        case 'FR_fr': {
            if(!message.channel.nsfw) return message.channel.send({ content: `:x: - ${message.author} le salon n'est pas NSFW.` })

            fetch(`https://nekobot.xyz/api/image?type=squirt`)
                .then(res => res.json())
                .then(data => {
                    console.log(data.message)
                    const attachment = new MessageAttachment(`${data.message}`);

                    message.channel.send({
                        embeds: [{
                            color: 'RED',
                            title: `:underage: Mouille`,
                            description: `L'image ne s'affiche pas ? [Cliquez ici](${data.message})`,
                            image: {
                                url: `${data.message}`
                            }
                        }],
                    })
                })
            break;
        }

        case 'EN_en': {
            if(!message.channel.nsfw) return message.channel.send({ content: `:x: - ${message.author} the channel is not NSFW.` })

            fetch(`https://nekobot.xyz/api/image?type=squirt`)
            .then(res => res.json())
            .then(data => {
                const attachment = new MessageAttachment(`${data.message}`);

                message.channel.send({
                    embeds: [{
                        color: 'RED',
                        title: `:underage: Squirt`,
                        description: `Image not showing ? [Click here](${data.message})`,
                        image: {
                            url: `${data.message}`
                        }
                    }],
                })
            })
            break;
        }
    }
    }
}