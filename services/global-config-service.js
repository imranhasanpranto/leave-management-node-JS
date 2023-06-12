const global_config = require('../models/global-config')

async function getAnnualLeaveCount(){
    const x = await global_config.findOne({configName: 'yearly-leave'})
    return x
}

module.exports = {getAnnualLeaveCount}