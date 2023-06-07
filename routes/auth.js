const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const users = require('../models/user')

const validator = require('@hapi/joi')
const user = require('../models/user')
const registrationSchema = validator.object({
    name: validator.string().required(),
    email: validator.string().required().email(),
    password: validator.string().required()
})

router.post('/register', async (req, res)=>{
    const isEmailExist = await users.findOne({email: req.body.email})
    if(isEmailExist){
        return res.status(400).json({status: false, message: 'Email already exists'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const userInfo = new users({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        user_type: 'Employee'
    })

    try {
        const {error} = await registrationSchema.validateAsync(req.body)
        if(error){
            res.status(400).json({status: false, message: error.details[0].message})
        }else{
            const savedUser = await userInfo.save()
            res.status(200).json({status: true, message: 'user created!!!'})
        }
    } catch (error) {
        res.status(500).json({status: false, message: error})
    }
})

const loginSchema = validator.object({
    email: validator.string().required().email(),
    password: validator.string().required()
})

router.post('/authenticate', async (req, res)=>{
    const userInfo = await users.findOne({email: req.body.email})
    if(!userInfo){
        return res.status(400).json({status: false, message: 'incorrect email/password'})
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, userInfo.password)
    if(!isPasswordValid){
        return res.status(400).json({status: false, message: 'incorrect email/password'})
    }

    try {
        const {error} = await loginSchema.validateAsync(req.body)
        if(error){
            res.status(400).json({status: false, message: error.details[0].message})
        }else{
            const tokenString = jwt.sign({userId: userInfo._id, role: userInfo.user_type}, process.env.SECRET_KEY)
            res.status(200).json({token: tokenString})
        }   
    } catch (error) {
        res.status(500).json({status: true, message: error})
    }
})

router.get('/isUserEmailTaken/:email', async (req, res)=>{
    console.log(req.params)
    const isEmailExist = await users.findOne({email: req.params.email})
    if(isEmailExist){
        res.status(200).json({status: true})
    }else{
        res.status(200).json({status: false})
    }
})

module.exports = router