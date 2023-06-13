const leave_application = require('../models/leave-application')
const validator = require('@hapi/joi')
const mongoose = require('mongoose')
const {saveFile} = require('../services/file-service')
const {getAllRequestsByUserId, getAllRequests, getById, updateStatus, getAllLeaveDates, getLeaveCount, getLeaveCountbalance, updateAnnualLeavesCount} = require('../services/application-service')
const {getUserById} = require('../services/user-service')
const {updateLeaveBalance} = require('../services/leave-count-service')
const {saveLeaveDaysByApplicationId, deleteByAppId} = require('../services/leave-days-service')
const {getLeaveBalance} = require('../services/leave-count-service')
const moment = require('moment')

const addApplication = async (req, res)=>{
    const {userId, role} = req.user
    let path = ''
    if(req.file){
        path = saveFile(req.file, userId)
    }else{
        console.log('no file found')
    }

    let leaveDaysDTO = await getLeaveCount(req.body.fromDate, req.body.toDate, userId, '-1')
    const year = new Date().getFullYear()
    let leaveBalance = await getLeaveBalance(userId, year)
    let currentBalance = leaveBalance.value - leaveDaysDTO.leaveCount
    if(currentBalance < 0){
        return res.status(400).json({status: false, message: 'Annual Leave Count Exceeded!'})
    }
    await updateLeaveBalance(userId, currentBalance)

    const userInfo = await getUserById(userId)

    let app_id = new mongoose.Types.ObjectId()
    const applicationSchema = new leave_application({
        _id: app_id,
        userId: userId,
        userName: userInfo.name,
        fromDate: new Date(moment(req.body.fromDate).format('YYYY-MM-DD')),
        toDate: new Date(moment(req.body.toDate).format('YYYY-MM-DD')),
        leaveType: req.body.leaveType,
        leaveReason: req.body.leaveReason,
        emergencyContact: req.body.emergencyContact,
        applicationStatus: 'Pending',
        leaveCount: leaveDaysDTO.leaveCount,
        filePath: path
    })

    try {
        const application = await applicationSchema.save()

        await saveLeaveDaysByApplicationId(leaveDaysDTO.leaveDays, app_id)

        res.status('200').json({status: true, message: 'Leave request added successfully'})
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const updateApplication = async (req, res)=>{
    const {userId, role} = req.user
    console.log(req.body, req.file)

    const applicationOld = await getById(req.body.id)

    let path = applicationOld.filePath
    if(req.body.isFileUpdated=='true'){
        path = ''
        if(req.file){
            path = saveFile(req.file, userId)
        }else{
            console.log('no file found')
        }
    }


    let leaveDaysDTO = await getLeaveCount(req.body.fromDate, req.body.toDate, userId, req.body.id)
    const year = new Date().getFullYear()
    let leaveBalance = await getLeaveBalance(userId, year)
    let currentBalance = leaveBalance.value - leaveDaysDTO.leaveCount + applicationOld.leaveCount
    if(currentBalance < 0){
        return res.status(400).json({status: false, message: 'Annual Leave Count Exceeded!'})
    }
    await updateLeaveBalance(userId, currentBalance)
   
    applicationOld.fromDate = new Date(moment(req.body.fromDate).format('YYYY-MM-DD'))
    applicationOld.toDate = new Date(moment(req.body.toDate).format('YYYY-MM-DD'))
    applicationOld.leaveType = req.body.leaveType
    applicationOld.leaveReason = req.body.leaveReason
    applicationOld.emergencyContact = req.body.emergencyContact
    applicationOld.applicationStatus = 'Pending'
    applicationOld.leaveCount = leaveDaysDTO.leaveCount
    applicationOld.filePath = path

    try {
        const application = await applicationOld.save()

        await deleteByAppId(applicationOld._id)
        await saveLeaveDaysByApplicationId(leaveDaysDTO.leaveDays, applicationOld._id)

        res.status('200').json({status: true, message: 'Leave request updated successfully'})
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const getPendingList = async (req, res)=>{
    const {userId, role} = req.user
    try {
        if(role ==="Admin"){
            const list = await getAllRequests('Pending')
            res.status(200).json(list)
        }else{
            const list = await getAllRequestsByUserId('Pending', userId)
            res.status(200).json(list)
        }
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const getApplicationById = async (req, res)=>{
    const {userId, role} = req.user
    const app_id = req.params.app_id
    
    try {
        const application = await getById(app_id)
        res.status(200).json(application)
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const getApprovedApplicationList = async (req, res)=>{
    const {userId, role} = req.user
    try {
        const list = await getAllRequests('Approved')
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const approveApplication = async (req, res)=>{
    const {userId, role} = req.user
    try {
        await updateStatus(req.params.app_id, 'Approved', userId)
        res.status(200).json({status: true, message: 'status updated!!!'})
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const rejectApplication = async (req, res)=>{
    const {userId, role} = req.user
    try {
        await updateStatus(req.params.app_id, 'Rejected', userId)
        res.status(200).json({status: true, message: 'status updated!!!'})
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const cancelApplication = async (req, res)=>{
    const {userId, role} = req.user
    try {
        await updateStatus(req.params.app_id, 'Canceled', userId)
        res.status(200).json({status: true, message: 'status updated!!!'})
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const getAllLeaveDatesByApplicationId = async (req, res)=>{
    const {userId, role} = req.user
    try {
        const list = await getAllLeaveDates(userId, req.params.app_id)
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}

const isAnnualLeaveCountExceedsByApplicationIdId = async (req, res)=>{
    const {userId, role} = req.user
    try {
        let count = await getLeaveCountbalance(req.params.fromDate, req.params.toDate, userId, req.params.app_id)
        let status = false
        if(count < 0){
            status = true
        }
        res.status(200).json({status: status})
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed!'})
    }
}
module.exports = {
    addApplication, updateApplication, getPendingList, 
    getApplicationById, getApprovedApplicationList,
    approveApplication, rejectApplication, cancelApplication,
    getAllLeaveDatesByApplicationId, isAnnualLeaveCountExceedsByApplicationIdId
}