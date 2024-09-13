const path = require('path')
const { parse } = require('csv-parse')
const fs = require('fs')

const planets = require('./planets_mongo')

function habitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
  // && planet[' koi_prad'] < 1.6

}
function loadPlanetData() {
  console.log('fghj')
  return new Promise((resolve, reject) => {
    console.log('promise')
    // create readstream - readable data 
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      //pipe - readable stream source to writable stream code
      //readable.pipe(writable) - pipe
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        /* if (habitable(data)) {
          habitablePlanets.push(data)*/
        if (habitablePlanet(data)) {
          savePlanets(data)
         }
      })
      .on('err', (err) => {
        console.log(err)
        reject(err)
      })
      .on('end',async () => {
        const totalPlanetsCount = (await getAllPlanets()).length
        console.log(`${totalPlanetsCount} Habitable planets found !`)
        resolve()
      })
  })
}
//parse();

async function getAllPlanets() {
  return await planets.find({}, {
    '_id': 0, '__v': 0
    // excluding property
  })
}
async function savePlanets(planet) {
  try {
    // Upset === update + insert 
    // if document already exists it updates the document, if the document is not present it inserts the documents
    await planets.updateOne({
      // inserting
      keplerName: planet.kepler_name
    }, {
      // updating
      keplerName: planet.kepler_name
    }, {
      upsert: true
    })
  } catch (err) {
    console.error(`could not save planets ${err}`)
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetData
}