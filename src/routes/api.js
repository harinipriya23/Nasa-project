const express = require('express')

const planetsRouter = require('./planets/planets_routes')
const launchRouter = require('./launches/launch_routes')

const api = express.Router()

api.use('/planets', planetsRouter)
api.use('/launches', launchRouter)

module.exports = api