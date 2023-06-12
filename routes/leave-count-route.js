const router = require('express').Router()
const {getUserLeaveBalance} = require('../controllers/leave-count-controller')

router.get('/getLeaveBalance', getUserLeaveBalance)

module.exports = router