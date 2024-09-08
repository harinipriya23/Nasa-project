const express = require('express')
const { httpGetAllLaunch,
 httpAddNewLaunch
 } = require('./launch_controller')

const launchRouter = express.Router()

launchRouter.get('/', httpGetAllLaunch)
launchRouter.post('/', httpAddNewLaunch)

module.exports = launchRouter;