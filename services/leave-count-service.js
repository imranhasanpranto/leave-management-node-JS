const leave_count = require('../models/leave_count')
const {getAnnualLeaveCount} = require('./global-config-service')

async function getLeaveBalance(userId, year){
    let leaveCount = await leave_count.findOne({userId: userId, year: year})
    return leaveCount
}

async function setUserAnnualLeaveCount(userId, year){
    const annualLeaveCount = await getAnnualLeaveCount();
    const leaveCount = new leave_count({
        userId: userId,
        year: year,
        value: annualLeaveCount.configValue
    })

    try {
        return await leaveCount.save()
    } catch (error) {
        return null
    }
}

async function updateLeaveBalance(userId, balance){
    const year = new Date().getFullYear()
    return await leave_count.updateOne({userId: userId, year: year}, { $set : {value: balance}})
}

async function updateUserAnnualLeaveCount(currentValue, prevValue){
    const year = new Date().getFullYear()
    const diff = currentValue - prevValue;
    return await leave_count.updateMany({year: year}, {$inc: {value: diff}})
}

module.exports = {setUserAnnualLeaveCount, updateUserAnnualLeaveCount, getLeaveBalance, updateLeaveBalance}