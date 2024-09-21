const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require("../../services/mongo")

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect()
  })
  afterAll(async () => {
    await mongoDisconnect()
  })
  describe('Test GET /launches', () => {
    test('Response must be 200', async () => {
      console.log('get launches')
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      destination: 'Kepler-62 f',
      launchDate: 'January 4, 2040',
    }
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      destination: 'Kepler-62 f',
    }
    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      destination: 'Kepler-62 f',
      launchDate: 'May',
    }
    test('Response must be 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)
      const requestDate = new Date(completeLaunchData.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()
      expect(responseDate).toBe(requestDate)
      expect(response.body).toMatchObject(launchDataWithoutDate)
    })
    // test('Catch missing required properties', async () => {
    //  const response = await request(app)
    //  .post('/launches')
    //  .send(launchDataWithInvalidDate)
    //  .expect('Content-Type', /json/)
    //  .expect(400);
    // expect(response.body).toStrictEqual({
    //  error: 'Invalid launch date'
    // })

    // })
    test('Catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(404);
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property !'
      })
    })
    test('Catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
      })
    })
  })
}, 20000)
