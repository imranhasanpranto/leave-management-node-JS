const users = require('../models/user')

async function getUserById(userId){
    const user = await users.findById(userId)
    return user
}

async function isUserEmailExist(email){
    return await users.findOne({email: email})
}

module.exports = {getUserById, isUserEmailExist}