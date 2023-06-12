const router = require('express').Router()
const leave_days = require('../models/leave-days')
const {getLeaveDaysByApplicationId} = require('../services/leave-days-service')

router.get('/getLeaveDays/:app_id', async(req,res)=>{
    let leaveDaysList = await getLeaveDaysByApplicationId(req.params.app_id)
    res.status(200).json(leaveDaysList)
})

module.exports = router