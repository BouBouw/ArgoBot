const db = require('quick.db');

module.exports = {
    name: 'presenceUpdate',
    once: false,
    execute: async (oldPresence, newPresence, client) => {
        const bot_settings = db.get(`bot_settings_${client.user.id}`)
        const guild = client.guilds.cache.get(bot_settings[3])

        let presence = db.get(`client_${client.user.id}_presence`)
        if(!presence) {
            await db.set(`client_${client.user.id}_presence`, ['disable', 'x', 'x'])
        }

        // Pattern: ['status', 'presence', 'role']
        let status = newPresence.activities.map(a => a.state)

        if(presence[0] === 'enable') {
            if(status[0] && status[0].includes(presence[1])) {
                const role = guild.roles.cache.get(presence[2])
                if(!role) return;
                
                await newPresence.member.roles.add(role)
            } else {
                const role = guild.roles.cache.get(presence[2])
                if(!role) return;

                await newPresence.member.roles.remove(role)
            }
        }
    }
}