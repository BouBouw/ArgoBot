module.exports = {
    name: "ping",
    aliases: [],
    description: "",
execute: async (client, message, args) => {
    message.channel.send(`:ping_pong: • ${message.author} pong!`)
    }
}