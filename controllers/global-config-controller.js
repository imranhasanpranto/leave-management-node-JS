const global_config = require('../models/global-config')
const {addGlobalConfiguration, updateGlobalConfiguration} = require('../services/global-config-service')

const {UnAuthorizedAccessError} = require('../exceptions/UnAuthorizedAccessError')
const {AlreadyExistsError} = require('../exceptions/AlreadyExistsError')
const {MethodArgumentNotValidError} = require('../exceptions/MethodArgumentNotValidError')
const {NotFoundError} = require('../exceptions/NotFoundError')

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
    try {
        await addGlobalConfiguration(req)
        res.status(200).json({status: true, message: 'global config added!!!'})
    } catch (error) {
        if(
            error instanceof AlreadyExistsError || 
            error instanceof MethodArgumentNotValidError || 
            error instanceof UnAuthorizedAccessError
            ){
            return res.status(error.httpCode).json({status: false, message: error.message})
        }else{
            res.status(500).json({status: false, message: "Server error"})
        }
    }
}

const updateGlobalConfig = async (req, res)=>{
    try {
        await updateGlobalConfiguration(req)
        res.status(200).json({status: true, message: req.body.configName+' updated successfully'})
    } catch (error) {
        if(
            error instanceof NotFoundError ||  
            error instanceof UnAuthorizedAccessError
            ){
            return res.status(error.httpCode).json({status: false, message: error.message})
        }else{
            res.status(500).json({status: false, message: "Server error"})
        }
    }
}

module.exports = {getByConfigName, addGlobalConfig, updateGlobalConfig}