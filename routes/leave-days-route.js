const router = require('express').Router()
const {getLeaveDaysByApplication} = require('../controllers/leave-days-controller')

router.get('/getLeaveDays/:app_id', getLeaveDaysByApplication)

module.exports = router