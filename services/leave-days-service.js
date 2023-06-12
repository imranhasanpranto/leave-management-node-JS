const leave_days = require('../models/leave-days')
const moment = require('moment')

async function getLeaveDaysByApplicationId(app_id){
    let list =  await leave_days.find({applicationId: app_id})
    let finalList = []
    for(let i = 0; i < list.length; i++){
        let dto = {
            'id': list[i]._id,
            'leaveApplicationId': list[i].applicationId,
            'leaveDate': moment(list[i].leaveDate).format('YYYY-MM-DD')
        }
        finalList.push(dto)
    }
    return finalList
}

async function deleteByAppId(app_id){
    await leave_days.deleteMany({applicationId: app_id})
}

async function saveLeaveDaysByApplicationId(leaveDaysList, app_id){
    let insertList = []
    for(let i = 0; i < leaveDaysList.length; i++){
        let schema = new leave_days({
            applicationId: app_id,
            leaveDate: leaveDaysList[i]
        })
        insertList.push(schema)
    }
    await leave_days.insertMany(insertList)
}

module.exports = {getLeaveDaysByApplicationId, saveLeaveDaysByApplicationId, deleteByAppId}