const {HttpStatus} = require('../enums/http-status-codes')
const {BaseError} = require('./BaseError')

class NotFoundError extends BaseError{
    constructor(message){
        super(message, HttpStatus.NOT_FOUND)
    }
}

module.exports = {NotFoundError}