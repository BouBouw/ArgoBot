const db = require('quick.db');

module.exports = {
    name: 'messageUpdate',
    once: false,
    execute: async (oldMessage, newMessage, client) => {
        const arr = db.get(`global_settings_${client.user.id}`)

        const array = db.get(`client_${client.user.id}_logs`)
        if(!array) return;
        const logs = client.channels.cache.get(array[2])

        await editMessage();

        async function editMessage() {
            if(!logs) return;
            
            if(oldMessage.author.bot) return;

            if(oldMessage.attachments.size > 0) {
                return;
            }

            switch(arr[0]) {
                case 'FR_fr': {
                logs.send({
                    embeds: [{
                        color: '#32a88b',
                        description: `[\`MESSAGE\`] ${oldMessage.author} (\`${oldMessage.author.id}\`) à modifier son [message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}) dans ${oldMessage.channel}.`,
                        author: {
                            name: `${oldMessage.author.tag}`,
                            icon_url: `${oldMessage.author.avatarURL()}`,
                        },
                        fields: [
                            {
                                name: `Avant:`,
                                value: `\`\`\`${oldMessage}\`\`\``
                            },
                            {
                                name: `Après`,
                                value: `\`\`\`${newMessage}\`\`\``
                            }
                        ]
                    }]
                })
                break;
                }

                case 'EN_en': {
                    logs.send({
                        embeds: [{
                            color: '#32a88b',
                            description: `[\`MESSAGE\`] ${oldMessage.author} (\`${oldMessage.author.id}\`) has edited his [message](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}) on ${oldMessage.channel}.`,
                            author: {
                                name: `${oldMessage.author.tag}`,
                                icon_url: `${oldMessage.author.avatarURL()}`,
                            },
                            fields: [
                                {
                                    name: `Before:`,
                                    value: `\`\`\`${oldMessage}\`\`\``
                                },
                                {
                                    name: `After`,
                                    value: `\`\`\`${newMessage}\`\`\``
                                }
                            ]
                        }]
                    })
                    break;
                }
            }
        }
    }
}