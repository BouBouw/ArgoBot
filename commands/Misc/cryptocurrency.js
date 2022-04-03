const fetch = require('node-fetch')
const db = require('quick.db');

module.exports = {
    name: "cryptocurrency",
    aliases: ['crypto'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    switch(arr[0]) {
        case 'FR_fr': {
            const cryptoName = args.slice(0).join(' ');
            if(!cryptoName) return message.channel.send({ content: `:x: - ${message.author} vous devez fournir le nom d'une crypto-monnaie.` })

            if(cryptoName === 'avax' && cryptoName === 'avalanche') {
                cryptoName = 'avalanche-2'
            } else if(cryptoName === 'cake') {
                cryptoName = 'pancakeswap-token'
            }

            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${cryptoName}`
            );
            const data = await response.json();

            if(!data) {
                return message.channel.send({ content: `:x: - ${message.author} aucune information crypto-commerciale trouvée pour **${cryptoName}**.` })
            } else {

                let link = ""
                if(data.links) {
                    link = data.links.homepage[0]
                } else {
                    link = 'Aucun site internet trouvé'
                }

                message.channel.send({
                    embeds: [{
                        color: `#326e2f`,
                        title: `${data.name} [${data.symbol}]`,
                        fields: [
                            {
                                name: `Site`,
                                value: `${link}`
                            },
                            {
                                name: `Adresse`,
                                value: `\`${data.platforms.ethereum}\``
                            },  
                            {
                                name: `Prix`,
                                value: `EUR ⇾ **${data.market_data.current_price.eur}** €\n USD ⇾ **${data.market_data.current_price.usd}** $`,
                                inline: true
                            },
                        ],
                        thumbnail: {
                            url: `${data.image.large}`,
                        },
                    }]
                })
            }

            break;
        }

         case 'EN_en': {
            const cryptoName = args.slice(0).join(' ');
            if(!cryptoName) return message.channel.send({ content: `:x: - ${message.author} you must provide the name of a cryptocurrency.` })

            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${cryptoName}`
            );
            const data = await response.json();

            if(!data) {
                return message.channel.send({ content: `:x: - ${message.author} no crypto trading information found for **${cryptoName}**.` })
            } else {

                let link = ""
                if(data.links) {
                    link = data.links.homepage[0]
                } else {
                    link = 'No website found'
                }

                message.channel.send({
                    embeds: [{
                        color: `#326e2f`,
                        title: `${data.name} [${data.symbol}]`,
                        fields: [
                            {
                                name: `Website`,
                                value: `${link}`
                            },
                            {
                                name: `Adress`,
                                value: `\`${data.platforms.ethereum}\``
                            },  
                            {
                                name: `Price`,
                                value: `EUR ⇾ **${data.market_data.current_price.eur}** €\n USD ⇾ **${data.market_data.current_price.usd}** $`,
                                inline: true
                            },
                        ],
                        thumbnail: {
                            url: `${data.image.large}`,
                        },
                    }]
                })
            }

            break;
         }
    }

    }
}