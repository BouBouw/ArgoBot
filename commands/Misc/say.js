const db = require('quick.db');

module.exports = {
    name: "say",
    aliases: ['repeat'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)
    if(arr[0] === 'FR_fr') {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send(`:x: - ${message.author} vous n'avez pas la permission d'utiliser cette commande.`)

        const txt = args.slice(0).join(' ') || "Rien d'intérressant :angry:"
        message.channel.send(txt)
    } else {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send(`:x: - ${message.author} you do not have permission to use this command.`)

        const txt = args.slice(0).join(' ') || "Nothing interesting :angry:"
        message.channel.send(txt)
    }

    }
}