const {setUserAnnualLeaveCount, getLeaveBalance} = require('../services/leave-count-service')

const getUserLeaveBalance = async (req, res)=>{
    const {userId, role} = req.user
    const year = new Date().getFullYear()
    
    let leaveCount = await getLeaveBalance(userId, year)
    if(leaveCount){
        res.status(200).json(leaveCount)
    }else{
        leaveCount = await setUserAnnualLeaveCount(userId, year);
        if(leaveCount === null){
            res.status(500).json({status: false, message: 'Error'})
        }else{
            res.status(200).json(leaveCount)
        }
    }
}

module.exports = {getUserLeaveBalance}