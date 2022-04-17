const colors = require('colors');
const express = require("express");
const moment = require('moment');
const session  = require('express-session'), passport = require('passport'), {Strategy} = require('passport-discord');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];
const prompt = 'consent'
const config = require('../config.json')

module.exports = async (client) => {
    await requestServer();

    const port = 3000

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '/Models')));

    app.listen(port, () => {
        console.log(`[${moment().format('DD/MM/YYYY, h:mm:ss')}]`.bold.blue + ` | Serveur web démarrer sur : ` + `http://185.142.53.79:${port}/${client.user.id}`.bold.blue.underline)
    })

    async function requestServer() {
        app.use(function (req, res, next) {
            console.log(`[${moment().format('DD/MM/YYYY, h:mm:ss')}]`.bold.blue + ` | Requête d'accès au serveur web`);
            next();          
        })
    }

    app.use(session({
        secret: 'tjstykjqrehzegdwhsfrtjhqergqehrtehyeqh',
        resave: false,
        saveUninitialized: false
    }));
    app.use((req, res, next) => {
        req.user = req.session.user;
        next();
    });
    passport.use(new Strategy({
        clientID: `883405114470178856`,
        clientSecret: `pXVHjzZ_l_DfCdYHOksNR9HuGsWIuMPi`,
        callbackURL: 'http://localhost:3000/discord/callback',
        scope: scopes,
        prompt: prompt
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });
    
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/', require('./routes/index'));
    app.use('/discord', require('./routes/discord'));
    app.use('/App/_lang/fr/main/documentation_main', require('./routes/index'));


    app.listen(5000, function (err) {
        if (err) return console.log(err)
        console.log('Listening at http://localhost:5000/')
    })
}