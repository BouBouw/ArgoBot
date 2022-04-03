module.exports = {
    name: "colors",
    aliases: ['color'],
    description: "",
execute: async (client, message, args) => {
    if(message.author.id === '853261887520505866') {
        message.channel.send({
            embeds: [{
                title: `Liste des couleurs d'embed`,
                description: `
                Owners - #000000
                Administration - #f71b2e
                Moderation - #ffffff
                Miscellanous - #326e2f
                Protection - #c48206
                Economy - #f5f540
                Giveaway - #6f21ff
                NSFW - #40b0f5
                `
            }]
        })
    }
    }
}