const weather = require('weather-js');
const db = require('quick.db');

module.exports = {
    name: "weather",
    aliases: ['meteo'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    if(arr[0] === 'FR_fr') {
        if(!args) return message.channel.send({ contnet: `:x: - ${message.author} vous devez fournir une ville.` })

        weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
            try {
                let skyText = ''
                if(result[0].current.skytext == 'Cloudy') {
                    skyText = '🌥️ Nuageux'
                } else if(result[0].current.skytext == 'Rain') {
                    skyText = '🌧️ Pluvieux'
                } else if(result[0].current.skytext == 'Partly Cloudy') {
                    skyText = '☁️ Partiellement nuageux'
                } else if(result[0].current.skytext == 'Sunny') {
                    skyText = '☀️ Ensolleilé'
                } else {
                    skyText = '☀️ Ensolleilé'
                }

                return message.channel.send({
                    embeds: [{
                        color: '#42853e',
                        title: `Météo de ${result[0].location.name}`,
                        thumbnail: {
                            url: `${result[0].current.imageUrl}`,
                        },
                        fields: [
                            {
                                name: `Température`,
                                value: `${result[0].current.temperature} °C`,
                            },
                            {
                                name: `Ciel`,
                                value: `${skyText}`,
                            },
                            {
                                name: `Vitesse de vent`,
                                value: `${result[0].current.windspeed}`,
                                inline: true 
                            },
                            {
                                name: `Humidité`,
                                value: `${result[0].current.humidity}%`,
                                inline: true
                            }
                        ],
                    }]
                })
            } catch(err) {
                return message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} une erreur est survenue, nous ne parvenons pas a trouver la météo de la ville souhaiter.`})
            }
        })
    } else {
        if(!args) return message.channel.send({ contnet: `:x: - ${message.author} you must provide a city.` })

        weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
            try {
                let skyText = ''
                if(result[0].current.skytext == 'Cloudy') {
                    skyText = '🌥️ Cloudy'
                } else if(result[0].current.skytext == 'Rain') {
                    skyText = '🌧️ Rain'
                } else if(result[0].current.skytext == 'Partly Cloudy') {
                    skyText = '☁️ Partly Cloudy'
                } else if(result[0].current.skytext == 'Sunny') {
                    skyText = '☀️ Sunny'
                } else {
                    skyText = '☀️ Sunny'
                }

                return message.channel.send({
                    embeds: [{
                        color: '#42853e',
                        title: `${result[0].location.name} weather`,
                        thumbnail: {
                            url: `${result[0].current.imageUrl}`,
                        },
                        fields: [
                            {
                                name: `Temperature`,
                                value: `${result[0].current.temperature} °C`,
                            },
                            {
                                name: `Sky`,
                                value: `${skyText}`,
                            },
                            {
                                name: `Wind speed`,
                                value: `${result[0].current.windspeed}`,
                                inline: true 
                            },
                            {
                                name: `Humidity`,
                                value: `${result[0].current.humidity}%`,
                                inline: true
                            }
                        ],
                    }]
                })
            } catch(err) {
                return message.channel.send({ content: `:hourglass_flowing_sand: - ${message.author} an error has occurred, we are unable to find the desired city weather.`})
            }
        })
    }

    }
}