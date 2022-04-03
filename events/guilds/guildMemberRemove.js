const db = require('quick.db');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    execute: async (member, client) => {
        const arr = db.get(`global_settings_${client.user.id}`)
        const bot_settings = db.get(`bot_settings_${client.user.id}`)

        const leaveSettings = db.get(`leave_settings_${client.user.id}`)

        if(leaveSettings[0] == 'enable') {
            const channel = member.guild.channels.cache.get(leaveSettings[1])
            if(!channel) return;

            channel.send({
                content: `${leaveSettings[2]}`
            })
        }
    }
}