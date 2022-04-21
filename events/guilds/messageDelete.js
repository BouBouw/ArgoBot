const db = require('quick.db');

module.exports = {
    name: 'messageDelete',
    once: false,
    execute: async (message, client) => {
        const arr = db.get(`global_settings_${client.user.id}`)
        const bot_settings = db.get(`bot_settings_${client.user.id}`)

        const array = db.get(`client_${client.user.id}_logs`)
        if(!array) return;
        const logs = client.channels.cache.get(array[2])

        const entry = await message.guild.fetchAuditLogs({type: 'messageDelete'}).then(audit => audit.entries.first())

        await deleteMessage();
        await snipeMessage();

        async function deleteMessage() {
            if(!message.content) return;
            if(message.content.startsWith(arr[1])) return;
            if(!logs) return;

            if(message.author.bot) return;
            if(entry.executor.bot) return;

            switch(arr[0]) {
                case 'FR_fr': {
                    logs.send({
                        embeds: [{
                            color: '#32a88b',
                            description: `[\`MESSAGE\`] ${entry.executor} (\`${entry.executor.id}\`) à supprimer un message de ${message.author} (\`${message.author.id}\`).`,
                            author: {
                                name: `${entry.executor.tag}`,
                                icon_url: `${entry.executor.avatarURL()}`,
                            },
                            fields: [
                                {
                                    name: `Contenu`,
                                    value: `\`\`\`${message.content.replace(/`/g,"'")}\`\`\``
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
                            description: `[\`MESSAGE\`] ${entry.executor} (\`${entry.executor.id}\`) to delete a message from ${message.author} (\`${message.author.id}\`).`,
                            author: {
                                name: `${entry.executor.tag}`,
                                icon_url: `${entry.executor.avatarURL()}`,
                            },
                            fields: [
                                {
                                    name: `Content`,
                                    value: `\`\`\`${message.content.replace(/`/g,"'")}\`\`\``
                                }
                            ]
                        }]
                    })
                    break;
                }
            }
        }

        async function snipeMessage() {
            if(message.content.startsWith(arr[1])) return;
            await db.set(`snipe_${client.user.id}`, [`${message.author.id}`, `${message.content}`])
        }
    }
}