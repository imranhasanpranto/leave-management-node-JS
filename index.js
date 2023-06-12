const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const upload = multer()

const authRoute = require('./routes/auth')
const authVerify = require('./middleware/auth-verify')
const globalConfig = require('./routes/global-config')
const leaveCount = require('./routes/leave-count-route')
const leaveApplication = require('./routes/application-route')
const fileRoute = require('./routes/file-route')
const leaveDaysRoute = require('./routes/leave-days-route')

const app = express()
const port = process.env.PORT

mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser: true, useUnifiedTopology: true}
)

app.use(cors())
app.use("/api/auth", express.json(), authRoute)
app.use("/api/config", [upload.none(), authVerify], globalConfig)
app.use('/api/annual-leave', [express.json(),authVerify], leaveCount)
app.use("/api/leave/application", [upload.single('file'), authVerify], leaveApplication)
app.use('/api/leave-days', [express.json(),authVerify], leaveDaysRoute)
app.use('/api/file', fileRoute)

app.get('/', authVerify, (req, res)=>{
    res.send('working!!!')
})


app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})