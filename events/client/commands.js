const db = require('quick.db');

module.exports = {
	name: 'messageCreate',
	once: true,
	execute: async (message, client) => {
        awaitCommands();

        async function awaitCommands() {
            const arr = db.get(`global_settings_${client.user.id}`)
            const bot_settings = db.get(`bot_settings_${client.user.id}`)
            
            if(message.author.bot) return;
            if(!message.guild) return;
    
            if(message.guild.id !== bot_settings[3]) return;
        
            const args = message.content.trim().split(/ +/g)
            const commandName = args.shift().toLowerCase()
            const command = 
            client.commands.get(commandName.slice(arr[1].length)) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName.slice(arr[1].length)));
          
            if (!commandName.startsWith(arr[1])) return;
            if (command) {
                    message.delete().then(async () => {
                        command.execute(client, message, args)
                        console.log(`[COMMANDS] `.bold.red + `${arr[1]}${command.name}`.bold.blue + ` has been executed`.bold.white)
                    })
            }
        }
    }
}