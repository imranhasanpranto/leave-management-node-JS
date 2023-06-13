const {HttpStatus} = require('../enums/http-status-codes')
const {BaseError} = require('./BaseError')

class DataSaveError extends BaseError{
    constructor(message){
        super(message, HttpStatus.SERVER_ERROR)
    }
}

module.exports = {DataSaveError}