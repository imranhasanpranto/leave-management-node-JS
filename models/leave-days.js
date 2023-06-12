const mongoose = require('mongoose')

const leaveDaysSchema = mongoose.Schema({
    applicationId: {
        type: String,
        required: true
    },
    leaveDate: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('leave_days', leaveDaysSchema)