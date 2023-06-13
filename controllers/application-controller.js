const leave_application = require('../models/leave-application')
const validator = require('@hapi/joi')
const mongoose = require('mongoose')
const {saveFile} = require('../services/file-service')
const {
    getAllRequestsByUserId, getAllRequests, getById, updateStatus, 
    getAllLeaveDates, getLeaveCount, getLeaveCountbalance, 
    updateAnnualLeavesCount, getPendingApplicationList, addLeaveApplication,
    updateLeaveApplication
} = require('../services/application-service')
const {getUserById} = require('../services/user-service')
const {updateLeaveBalance} = require('../services/leave-count-service')
const {saveLeaveDaysByApplicationId, deleteByAppId} = require('../services/leave-days-service')
const {getLeaveBalance} = require('../services/leave-count-service')
const moment = require('moment')

const {DataSaveError} = require('../exceptions/DataSaveError')
const {MethodArgumentNotValidError} = require('../exceptions/MethodArgumentNotValidError')
const {NotFoundError} = require('../exceptions/NotFoundError')

const addApplication = async (req, res)=>{

    try {
        await addLeaveApplication(req)
        res.status('200').json({status: true, message: 'Leave request added successfully'})
    } catch (error) {
        if(error instanceof DataSaveError){
            return res.status(error.httpCode).json({status: false, message: error.message})
        }else if(error instanceof MethodArgumentNotValidError){
            return res.status(error.httpCode).json({status: false, message: error.message})
        }else{
            res.status(500).json({status: false, message: "Server error"})
        }
    }
}

const updateApplication = async (req, res)=>{
    try {
        await updateLeaveApplication(req)
        res.status('200').json({status: true, message: 'Leave request updated successfully'})
    } catch (error) {
        if(
            error instanceof DataSaveError || 
            error instanceof MethodArgumentNotValidError || 
            error instanceof NotFoundError
            ){
            return res.status(error.httpCode).json({status: false, message: error.message})
        }else{
            res.status(500).json({status: false, message: "Server error"})
        }
    }
}

const getPendingList = async (req, res)=>{
    try {
        const list = await getPendingApplicationList(req)
        res.status(200).json(list)
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