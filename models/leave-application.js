const mongoose = require('mongoose')

applicationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    leaveCount: {
        type: Number,
        required: true
    },
    leaveReason: {
        type: String,
        default: ''
    },
    emergencyContact: {
        type: String,
        default: ''
    },
    leaveType: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        default: ''
    }, 
    applicationStatus: {
        type: String,
        required: true
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

module.exports = mongoose.model('leave_application', applicationSchema)