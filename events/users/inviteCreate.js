const { Collection } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'inviteCreate',
    once: false,
    execute: async (invite, client) => {
        client.invites.get(invite.guild.id).set(invite.code, invite.uses);
    }
}