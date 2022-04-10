const colors = require('colors');

const express = require("express");
const moment = require('moment');

const fetch = require('node-fetch');

const app = express();

module.exports = async (client) => {
    await requestServer();

    const port = 3000
    const generatePages = require('../dashboard/App/index-get.js')

    app.get(`/${client.user.id}`, async (req, res) => {
        var variables = {
            "{clientTag}" : `${client.user.tag}`,
            "{clientAvatar}": `${client.user.avatarURL()}`
        }

        var indexHTML = await generatePages()

        for(var key in variables) {
            if (!variables.hasOwnProperty(key)) {
                continue;
            }
        
            indexHTML = await indexHTML.replace(key, variables[key]);
        }

        return res.send(indexHTML)
    })

    app.use('/styles', express.static('./dashboard/Models/styles/'));

    app.listen(port, () => {
        console.log(`[${moment().format('DD/MM/YYYY, h:mm:ss')}]`.bold.blue + ` | Serveur web démarrer sur : ` + `http://185.142.53.79:${port}/${client.user.id}`.bold.blue.underline)
    })

    async function requestServer() {
        app.use(function (req, res, next) {
            console.log(`[${moment().format('DD/MM/YYYY, h:mm:ss')}]`.bold.blue + ` | Requête d'accès au serveur web`);
            next();          
        })
    }
}