const express = require('express')
const {
 httpGetAllLaunch,
 httpAddNewLaunch,
 httpAbortLaunch
} = require('./launch_controller')

const launchRouter = express.Router()

launchRouter.get('/', httpGetAllLaunch)
launchRouter.post('/', httpAddNewLaunch)
launchRouter.delete('/:id', httpAbortLaunch)

module.exports = launchRouter;