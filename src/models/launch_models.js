const launches = new Map()
let latestFlightNumber = 100

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
launches.set(launch.flightNumber, launch)

function existsLaunchWithId(launchId) {
  return launches.has(launchId)
}

function getAllLaunch() {
  return Array.from(launches.values())
}
function addNewLaunch(launch) {
  latestFlightNumber++
  launches.set(latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ['NASA', 'GVT'],
      upcoming: true,
      success: true,
    }))
}
//console.log(launches)
function abortLaunchById(launchId) {
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

module.exports = {
  getAllLaunch,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}