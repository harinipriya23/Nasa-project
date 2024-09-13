const launchesDatabase = require('./launch_mongo')
const planets = require('./planets_mongo')

const launches = new Map()

let DEFAULT_FLIGHT_NUMBER = 100

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('september 20, 2030'),
  destination: 'Kepler-442 b',
  customer: ['NASA, GVT'],
  upcoming: true,
  success: true,
}
saveLaunch(launch)
//launches.set(launch.flightNumber, launch)

async function existsLaunchWithId(launchId) {
  //  launches.has(launchId)
  return await launchesDatabase.findOne({
    flightNumber: launchId
  })
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber')
  // descending order

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber
}
async function getAllLaunch() {
  // return Array.from(launches.values())
  return await launchesDatabase
  .find({},{'_id':0, '__v':0 })
}
/*function addNewLaunch(launch) {
  latestFlightNumber++
  launches.set(latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ['NASA', 'GVT'],
      upcoming: true,
      success: true,
    }))
}*/

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1
   
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customer: ['NASA', 'GVT'],
    upcoming: true,
    success: true,
  })
  await saveLaunch(newLaunch)
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName:launch.destination
  })
  if (!planet) {
    throw new Error('No matching planet found !')
  }
  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  },launch, {
    upsert: true
  })
}
//console.log(launches)
async function abortLaunchById(launchId) {
  const aborted =  await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false
 })
  return aborted.modifiedCount === 1
  // const aborted = launches.get(launchId)
  // aborted.upcoming = false
  // aborted.success = false
  // return aborted
}
 
module.exports = {
  getAllLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
}