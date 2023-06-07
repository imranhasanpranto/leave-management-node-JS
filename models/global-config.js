const mongoose = require('mongoose')

const configSchema = mongoose.Schema({
    configName: {
        type: String,
        required: true
    },
    configValue: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('global_config', configSchema)