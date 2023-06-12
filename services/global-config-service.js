const global_config = require('../models/global-config')

async function getAnnualLeaveCount(){
    const x = await global_config.findOne({configName: 'leave-count'})
    return x
}

module.exports = {getAnnualLeaveCount}