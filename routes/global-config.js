const router = require('express').Router()
const {getByConfigName, addGlobalConfig, updateGlobalConfig} = require('../controllers/global-config-controller')



router.get('/getByName/:name', getByConfigName)

router.post('/add', addGlobalConfig)

router.put('/update', updateGlobalConfig)

module.exports = router