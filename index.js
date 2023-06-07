const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const authRoute = require('./routes/auth')
const authVerify = require('./routes/auth-verify')
const globalConfig = require('./routes/global-config')

const app = express()
const port = process.env.PORT

mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser: true, useUnifiedTopology: true}
)

app.use(express.json(), cors())
app.use("/api/auth", authRoute)
app.use("/api/config", authVerify, globalConfig)

app.get('/', authVerify, (req, res)=>{
    res.send('working!!!')
})


app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})