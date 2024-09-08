const path = require('path')
const { parse } = require('csv-parse')
const fs = require('fs')

const habitablePlanets = []
function habitable(planet) {
 return planet['koi_disposition'] === 'CONFIRMED' &&
  planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
 // && planet[' koi_prad'] < 1.6

}
function loadPlanetData() {
 return new Promise((resolve, reject) => {
  // create readstream - readable data 
  fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
   //pipe - readable stream source to writable stream code
   //readable.pipe(writable) - pipe
   .pipe(parse({
    comment: '#',
    columns: true,
   }))
   .on('data', (data) => {
    if (habitable(data)) {
     habitablePlanets.push(data)
    }
   })
   .on('err', (err) => {
    console.log(err)
    reject(err)
   })
   .on('end', () => {
    console.log(`${habitablePlanets.length} Habitable planets found !`)
    resolve();

   })
 })
}
//parse();

function getAllPlanets() {
 return habitablePlanets
}

module.exports = {
 getAllPlanets,
 loadPlanetData
}