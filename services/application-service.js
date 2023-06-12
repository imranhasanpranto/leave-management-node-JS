const leave_application = require('../models/leave-application')
const moment = require('moment')
const {getLeaveBalance, updateLeaveBalance} = require('./leave-count-service')

async function getAllRequestsByUserId(applicationStatus, userId){
    let list = await leave_application.find({applicationStatus: applicationStatus, userId: userId})
    return list
}

async function getAllRequests(applicationStatus){
    const list = await leave_application.find({applicationStatus: applicationStatus})
    return list
}

async function getById(app_id){
    const application = await leave_application.findById(app_id)
    return application
}

async function getAllLeaveDates(userId, app_id){
    let app_status = ['Pending', 'Approved']
    let allLeaveDates = []
    let applications
    if(app_id == '-1'){
        applications = await leave_application.find({userId: userId, applicationStatus: {$in: app_status}})
        console.log(applications)
    }else{
        applications = await leave_application.find({userId: userId, _id: {$ne: app_id}, applicationStatus: {$in: app_status}})
    }
    
    for(let i = 0; i < applications.length; i++){
        let dates = getDates(applications[i].fromDate, applications[i].toDate)
        allLeaveDates = allLeaveDates.concat(dates)
    }
    return allLeaveDates
}

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

async function getLeaveCountbalance(fromDateMil, toDateMil, userId, app_id){
    let fromDate = moment.unix(fromDateMil/1000).format('YYYY-MM-DD')
    let toDate = moment.unix(toDateMil/1000).format('YYYY-MM-DD')

    let leaveDaysDTO = await getLeaveCount(fromDate, toDate, userId, app_id)
    const year = new Date().getFullYear()
    let leaveBalance = await getLeaveBalance(userId, year)
    console.log(leaveDaysDTO)
    console.log(leaveBalance)
    return leaveBalance.value - leaveDaysDTO.leaveCount;
}

async function getLeaveCount(fromDate, toDate, userId, app_id){
    let blockedList = await getAllLeaveDates(userId, app_id)
    let blockedSet = new Set()
    for(let i = 0; i < blockedList.length; i++){
        blockedSet.add(moment(blockedList[i]).valueOf())
    }

    return getAllLeaveDatesAndCount(fromDate, toDate, blockedSet)
}

async function updateAnnualLeavesCount(application, userId){
    let leaveDaysDTO = await getLeaveCount(application.fromDate, application.toDate, userId, application._id);
    const year = new Date().getFullYear()
    let leaveBalance = await getLeaveBalance(userId, year)
    let currentBalance = leaveBalance.value - leaveDaysDTO.leaveCount + Number(application.leaveCount)
    if(currentBalance < 0){
        throw "Annual Leave Count Exceeded!"
    }

    await updateLeaveBalance(userId, currentBalance)
}


function getAllLeaveDatesAndCount(fromDate, toDate, blockedSet){
    console.log(fromDate, toDate)
    let weekDay = moment(fromDate)
    let leaveDays = 0;
    let localDateList = []
    let stopDay = moment(toDate)
    while(weekDay <= stopDay){
        if(!blockedSet.has(weekDay.valueOf())){
            leaveDays++
            localDateList.push(weekDay.format('YYYY-MM-DD'))
        }
        if(weekDay.isoWeekday() == 5){
            weekDay = weekDay.add(3, 'days')
        }else{
            weekDay = weekDay.add(1, 'days');
        }
    }

    let LeaveDaysDTO = {
        'leaveDays': localDateList,
        'leaveCount': leaveDays
    }

    return LeaveDaysDTO
}

async function updateStatus(app_id, status, userId){
    let application = await leave_application.findById(app_id)
    if(status == 'Rejected' || status == 'Canceled'){
        const year = new Date().getFullYear()
        let leaveBalance = await getLeaveBalance(userId, year)
        let currentBalance = leaveBalance.value + application.leaveCount
        await updateLeaveBalance(userId, currentBalance)
    }
    application.applicationStatus = status
    try {
        application = await application.save()
    } catch (error) {
        throw error
    }
}

module.exports = {getAllRequestsByUserId, getAllRequests, getById, updateStatus, getAllLeaveDates, getLeaveCount, getLeaveCountbalance, updateAnnualLeavesCount}