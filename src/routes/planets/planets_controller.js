const { getAllPlanets } = require('../../models/planets_models')

async function httpGetAllPlanets(req, res) {
 return res.status(200).json(await getAllPlanets())
}

module.exports = {
 httpGetAllPlanets,
}