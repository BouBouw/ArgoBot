const db = require('quick.db')
const colors = require('colors');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute: async (member, client) => {
        const blacklist = db.get(`client_${client.user.id}_blacklist`)
        const { guild } = member.guild;
        
        if(db.get(`client_${client.user.id}_security_bots`) == 'enable') return member.kick({ reason: '[AUTO-MOD] Anti-bot activé.' })
        if(db.get(`client_${client.user.id}_security_join`) == 'enable') return member.kick({ reason: '[AUTO-MOD] Anti-join activé.' })

        if(!blacklist) {
            return;
        } else {
            if(blacklist.includes(member.user.id)) {
                await member.ban({ reason: '[AUTO-MOD] Blacklisted.'})
            }
        }
        
    }
}