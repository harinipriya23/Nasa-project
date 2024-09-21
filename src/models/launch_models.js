const { query } = require('express')
const launchesDatabase = require('./launch_mongo')
const planets = require('./planets_mongo')
const axios = require('axios')

const launches = new Map()

 let DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   flightNumber: 100,// flight_number
//   mission: 'Kepler Exploration X', // name
//   rocket: 'Explorer IS1', // rocket.name
//   launchDate: new Date('september 20, 2030'), //date_local
//   destination: 'Kepler-442 b', // not applicable
//   customers: ['NASA', 'GTA'], //payloads.customers
//   upcoming: true, //upcoming
//   success: true, // success
// }
//saveLaunch(launch)
//launches.set(launch.flightNumber, launch)
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
  console.log('loading launch data')
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        }, {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  })
  if (response.status !== 200) {
    console.log('problem occured in launching data !')
   throw new Error('launch data download failed !')
  }
  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap((payload) => {
      return payload['customers']
    })
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    }
    // console.log(customers)
   //  console.log(`${launch.flightNumber} ${launch.mission}`)
    await saveLaunch(launch)
    //console.log(launch)
  }
}
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat' 
  })
//  console.log('firstLaunch')
  if (firstLaunch) {
    console.log('launch data loaded already !')
  } else {
    await populateLaunches()
  }
}
async function findLaunch(filter) {
  return launchesDatabase.findOne(filter)
}
async function existsLaunchWithId(launchId) {
  //  launches.has(launchId)
  return await findLaunch({
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
async function getAllLaunch(skip, limit) {
  // return Array.from(launches.values())
  return await launchesDatabase
    .find({}, { '_id': 0, '__v': 0 })
    .sort({ flightNumber: 1})
    .skip(skip)
  .limit(limit)
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
  const planet = await planets.findOne({
    keplerName: launch.destination
  })
  if (!planet) {
    throw new Error('No matching planet found !')
  }
  const newFlightNumber = await getLatestFlightNumber() + 1

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['NASA', 'HP'],
    upcoming: true,
    success: true,
  })
  await saveLaunch(newLaunch)
  console.log(newLaunch)
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  })
  // console.log(launch)
}

//console.log(launches)
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({
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
  loadLaunchData,
  getAllLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
}