const db = require('quick.db');

module.exports = {
    name: 'inviteDelete',
    once: false,
    execute: async (invite, client) => {
        const invites = new Map();

        invites.get(invite.guild.id).delete(invite.code);
    }
}