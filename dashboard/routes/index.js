const router = require('express').Router();
const client = require('../../index')

router.get('/', (req, res) => {
    res.render('fr_index', {
        user: req.user,
        client: client,
    })
})

router.get('/documentation', (req, res) => {
    res.render('lang/fr/fr_documentation_main', {
        user: req.user,
        client: client,
    })
})

router.get('/subscribe', (req, res) => {
    res.render('lang/fr/fr_subscribe_main', {
        user: req.user,
        client: client,
    })
})

router.get(`/:id`, async (req, res) => {
    if(req.params.id === client.user.id) {
        return res.render('fr_index', {
            user: req.user,
            client: client,
        })
    } else {
        return res.redirect('/UwU')
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    return res.render('fr_index');
})

router.get(`/UwU`, (req, res) => {
    res.sender('error', {
        user: req.user,
        client: client,
    })
})


module.exports = router;