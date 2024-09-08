const { getAllPlanets } = require('../../models/planets_models')

function httpGetAllPlanets(req, res) {
 return res.status(200).json(getAllPlanets)
}

module.exports = {
 httpGetAllPlanets,
}