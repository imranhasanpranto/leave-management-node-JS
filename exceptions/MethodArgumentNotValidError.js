const {HttpStatus} = require('../enums/http-status-codes')
const {BaseError} = require('./BaseError')

class MethodArgumentNotValidError extends BaseError{
    constructor(message){
        super(message, HttpStatus.BAD_REQUEST)
    }
}

module.exports = {MethodArgumentNotValidError}