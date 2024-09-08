const express = require('express')
const { httpGetAllLaunch } = require('./launch_controller')

const launchRouter = express.Router()

launchRouter.get('/launches', httpGetAllLaunch)

module.exports = launchRouter;