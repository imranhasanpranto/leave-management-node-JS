const router = require('express').Router()
const {
    addApplication, updateApplication, getPendingList, 
    getApplicationById, getApprovedApplicationList, approveApplication,
    rejectApplication, cancelApplication,getAllLeaveDatesByApplicationId,
    isAnnualLeaveCountExceedsByApplicationIdId
} = require('../controllers/application-controller')

router.post('/add', addApplication)

router.put('/update', updateApplication)

router.get('/pendingList', getPendingList)

router.get('/getById/:app_id', getApplicationById)

router.get('/approvedList', getApprovedApplicationList)

router.put('/approve/:app_id', approveApplication)

router.put('/reject/:app_id', rejectApplication)

router.put('/cancel/:app_id', cancelApplication)

router.get('/getAllLeaveDates/:app_id', getAllLeaveDatesByApplicationId)

router.get('/isAnnualLeaveCountExceeds/:fromDate/:toDate/:app_id', isAnnualLeaveCountExceedsByApplicationIdId)

module.exports = router