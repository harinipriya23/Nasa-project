const { getAllLaunch } = require('../../models/launch_models')

function httpGetAllLaunch(req, res) {
 return res.status(200).json(getAllLaunch())
}

module.exports = {  
 httpGetAllLaunch,
}