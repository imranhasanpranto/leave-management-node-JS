const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const users = require('../models/user')

const {UserType} = require('../enums/user-type')
const {AlreadyExistsError} = require('../exceptions/AlreadyExistsError')
const {MethodArgumentNotValidError} = require('../exceptions/MethodArgumentNotValidError')
const {UnAuthorizedAccessError} = require('../exceptions/UnAuthorizedAccessError')
const {ServerError} = require('../exceptions/ServerError')

const {isUserEmailExist} = require('../services/user-service')

const validator = require('@hapi/joi')
const registrationSchema = validator.object({
    name: validator.string().required(),
    email: validator.string().required().email(),
    password: validator.string().required()
})

const loginSchema = validator.object({
    email: validator.string().required().email(),
    password: validator.string().required()
})

const userRegistration = async (req)=>{
   
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const userInfo = new users({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        user_type: UserType.Employee
    })


    const {error} = registrationSchema.validate(req.body)
    if(error){
        throw new MethodArgumentNotValidError(error.details[0].message)
    }else{
        const savedUser = await userInfo.save()
    }
}

const userAuthentication = async (req)=>{
    const userInfo = await users.findOne({email: req.body.email})
    if(!userInfo){
        throw new UnAuthorizedAccessError("Incorrect email/password")
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, userInfo.password)
    if(!isPasswordValid){
        throw new UnAuthorizedAccessError("Incorrect email/password")
    }

    
    const {error} = loginSchema.validate(req.body)
    if(error){
        throw new UnAuthorizedAccessError("Incorrect email/password")
    }else{
        const tokenString = jwt.sign({userId: userInfo._id, role: userInfo.user_type}, process.env.SECRET_KEY)
        return tokenString
    }   
}

module.exports = {userRegistration, userAuthentication}