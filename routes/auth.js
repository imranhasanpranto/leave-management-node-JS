const router = require('express').Router()
const {registration, authentication, isUserEmailTaken} = require('../controllers/auth-controller')

router.post('/register', registration)

router.post('/authenticate', authentication)

router.get('/isUserEmailTaken/:email', isUserEmailTaken)

module.exports = router