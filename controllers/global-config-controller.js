const global_config = require('../models/global-config')
const validator = require('@hapi/joi')
const {updateUserAnnualLeaveCount} = require('../services/leave-count-service')

const configSchema = validator.object({
    configName: validator.string().required(),
    configValue: validator.number().integer().required()
})

const getByConfigName = async (req, res)=>{
    const name = req.params.name
    const globalConfig = await global_config.findOne({configName: name})
    if(globalConfig){
        res.status(200).json(globalConfig)
    }else{
        res.status(404).json({status: false, message: `${name} not found`})
    }
}

const addGlobalConfig = async (req, res)=>{
    const {userId, role} = req.user
    if(role ==="Admin"){
        const globalConfig = await global_config.findOne({configName: req.body.configName})
        console.log(globalConfig)
        if(globalConfig){
            return res.status(409).json({status: false, messsage:'Already exists'})
        }else{
            const globalConfig = new global_config({
                configName: req.body.configName,
                configValue: req.body.configValue
            })

            try {
                const {error} = await configSchema.validateAsync(req.body)
                if(error){
                    res.status(400).json({status: false, message: error.details[0].message})
                }else{
                    const savedConfig = await globalConfig.save()
                    res.status(200).json({status: true, message: 'global config added!!!'})
                }
            } catch (error) {
                res.status(500).json({status: false, message: error})
            }
        }
    }else{
        res.status(401).json({status: false, messsage:'Unauthorized access'})
    }
}

const updateGlobalConfig = async (req, res)=>{
    const {userId, role} = req.user
    if(role ==="Admin"){
        let globalConfig = await global_config.findOne({configName: req.body.configName})
        if(globalConfig){
            await updateUserAnnualLeaveCount(req.body.configValue, globalConfig.configValue);
            globalConfig.configValue = req.body.configValue
            try {
                const savedConfig = await globalConfig.save()
                res.status(200).json({status: true, message: 'global config updated!!!'})
            } catch (error) {
                res.status(500).json({status: false, message: error})
            }
        }else{
            res.status(404).json({status: false, message: 'Not found'})
        }
    }else{
        res.status(401).json({status: false, messsage:'Unauthorized access'})
    }
}

module.exports = {getByConfigName, addGlobalConfig, updateGlobalConfig}