const colors = require('colors');

const express = require("express");
const moment = require('moment');

const app = express();

module.exports = async (client) => {
    await requestServer();

    const port = 3000

    app.get(`/${client.user.id}`, (req, res) => {
        res.send(`
        <title>Dashboard • ${client.user.username}</title>

        <p>${client.user.tag}<p>
        `)
    })

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