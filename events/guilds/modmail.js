const db = require('quick.db');

module.exports = {
	name: 'messageCreate',
	once: false,
	execute: async (message, client) => {
        if(message.channel.type == 'DM') {
            console.log('cc c moi')
        }
    }
}