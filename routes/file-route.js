const path = require('path');
const router = require('express').Router()

router.get('/get-file/:id/:filePath', (req, res)=>{
    const {id, filePath} = req.params
    const options = {
        root: path.join(__dirname, "../services/uploads", id)
    };
 
    const fileName = filePath;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('Sent:', fileName);
        }
    });
})

module.exports = router