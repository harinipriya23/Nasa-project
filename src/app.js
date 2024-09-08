const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const planetsRouter = require('./routes/planets/planets_routes')
const launchRouter = require('./routes/launches/launch_routes')

const app = express()

app.use(cors())
app.use(morgan('combined')) 
app.use(express.json())
app.use('/planets',planetsRouter)
app.use('/launches',launchRouter)




module.exports = app