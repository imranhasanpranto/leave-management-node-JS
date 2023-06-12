const path = require('path');
const router = require('express').Router()
const {getFileByUserAndPath} = require('../controllers/file-controller')

router.get('/get-file/:id/:filePath', getFileByUserAndPath)

module.exports = router