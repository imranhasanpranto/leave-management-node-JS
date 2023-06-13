const {HttpStatus} = require('../enums/http-status-codes')
const {BaseError} = require('./BaseError')

class UnAuthorizedAccessError extends BaseError{
    constructor(message){
        super(message, HttpStatus.UNAUTHORIZED)
    }
}

module.exports = {UnAuthorizedAccessError}