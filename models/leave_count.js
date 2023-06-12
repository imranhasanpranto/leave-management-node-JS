const mongoose = require('mongoose')

const leaveCountSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('leave_count', leaveCountSchema)