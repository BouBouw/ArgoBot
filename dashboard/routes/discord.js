const router = require('express').Router();
const checkAuth = require('../functions/checkAuth');
const passport = require('passport');

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];
const prompt = 'consent'

router.get('/login', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {});

router.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) {  res.redirect('/') });


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/info', checkAuth, function(req, res) {
    res.json(req.user);
});

module.exports = router;