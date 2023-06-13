const {HttpStatus} = require('../enums/http-status-codes')
const {BaseError} = require('./BaseError')

class AlreadyExistsError extends BaseError{
    constructor(message){
        super(message, HttpStatus.CONFLICT)
    }
}

module.exports = {AlreadyExistsError}