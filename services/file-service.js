const fs = require('fs');

function saveFile(file, userId){
    let folder = '/uploads/'+userId
    let path = Date.now()+'_'+file.originalname
    console.log(__dirname)
    fs.mkdirSync(__dirname+folder, {recursive: true});
    fs.writeFileSync(__dirname+folder+'/'+path, file.buffer)
    return userId+"/"+path
}



module.exports = {saveFile}