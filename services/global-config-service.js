const global_config = require('../models/global-config')
const validator = require('@hapi/joi')
const {updateUserAnnualLeaveCount} = require('../services/leave-count-service')

const {UnAuthorizedAccessError} = require('../exceptions/UnAuthorizedAccessError')
const {AlreadyExistsError} = require('../exceptions/AlreadyExistsError')
const {MethodArgumentNotValidError} = require('../exceptions/MethodArgumentNotValidError')
const {NotFoundError} = require('../exceptions/NotFoundError')

const configSchema = validator.object({
    configName: validator.string().required(),
    configValue: validator.number().integer().required()
})

async function getAnnualLeaveCount(){
    const x = await global_config.findOne({configName: 'leave-count'})
    return x
}

const addGlobalConfiguration = async (req)=>{
    const {userId, role} = req.user
    if(role ==="Admin"){
        try {
            console.log(req.body.configName)
        } catch (error) {
            console.log(error)
        }
        
        const globalConfig = await global_config.findOne({configName: req.body.configName})
        if(globalConfig){
            throw new AlreadyExistsError(globalConfig.configName+" already exists")
        }else{
            const globalConfig = new global_config({
                configName: req.body.configName,
                configValue: req.body.configValue
            })

            const {error} = configSchema.validate(req.body)
            if(error){
                throw new MethodArgumentNotValidError(error.details[0].message)
            }else{
                await globalConfig.save()
                return true
            }
            
        }
    }else{
        throw new UnAuthorizedAccessError("You don't have enough permission to add global configuration.")
    }
}

const updateGlobalConfiguration = async (req)=>{
    const {userId, role} = req.user
    if(role ==="Admin"){
        let globalConfig = await global_config.findOne({configName: req.body.configName})
        if(globalConfig){
            await updateUserAnnualLeaveCount(req.body.configValue, globalConfig.configValue);
            globalConfig.configValue = req.body.configValue
            
            const savedConfig = await globalConfig.save()
            return true
            
        }else{
            throw new NotFoundError(req.body.configName + ' doesnot exist')
        }
    }else{
        throw new UnAuthorizedAccessError("You don't have enough permission to add global configuration.")
    }
}

module.exports = {getAnnualLeaveCount, addGlobalConfiguration, }