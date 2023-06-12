const {getLeaveDaysByApplicationId} = require('../services/leave-days-service')

const getLeaveDaysByApplication = async(req,res)=>{
    let leaveDaysList = await getLeaveDaysByApplicationId(req.params.app_id)
    res.status(200).json(leaveDaysList)
}

module.exports = {getLeaveDaysByApplication}