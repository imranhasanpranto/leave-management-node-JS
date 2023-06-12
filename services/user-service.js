const users = require('../models/user')

async function getUserById(userId){
    const user = await users.findById(userId)
    return user
}

module.exports = {getUserById}