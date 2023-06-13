const {userRegistration, userAuthentication} = require('../services/auth-service')
const {MethodArgumentNotValidError} = require('../exceptions/MethodArgumentNotValidError')
const {UnAuthorizedAccessError} = require('../exceptions/UnAuthorizedAccessError')

const {isUserEmailExist} = require('../services/user-service')

const registration = async (req, res)=>{
    try {
        await userRegistration(req)
        return res.status(200).json({status: true, message: 'You have successfully registered.'})
    } catch (error) {
        if(error instanceof MethodArgumentNotValidError){
            return res.status(error.httpCode).json({status: false, message: error.message})
        }else{
            res.status(500).json({status: false, message: "Server error"})
        }
    }
}

const authentication = async (req, res)=>{

    try {
        const tokenString = await userAuthentication(req)
        res.status(200).json({token: tokenString})
    } catch (error) {
        if(error instanceof UnAuthorizedAccessError){
            return res.status(error.httpCode).json({status: false, message: error.message})
        }else{
            res.status(500).json({status: false, message: "Server error"})
        }
    }
}

const isUserEmailTaken = async (req, res)=>{
    try {
        const isEmailExist = await isUserEmailExist(req.params.email)
        if(isEmailExist){
            res.status(200).json({status: true})
        }else{
            res.status(200).json({status: false})
        }
    } catch (error) {
        res.status(500).json({status: false, message: "Server error"})
    }
}

module.exports = {registration, authentication, isUserEmailTaken}