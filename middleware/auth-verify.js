const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next){
    const tokenString = req.header('Authorization')
    if(!tokenString || !tokenString.startsWith('Bearer ')){
        return res.status(401).json({status: false, message: 'Access denied'})
    }
    const token = tokenString.substring(7)
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        console.log(verified)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({status: false, message: 'Invalid token'})
    }
}