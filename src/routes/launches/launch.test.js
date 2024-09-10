const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
 test('Response must be 200', async () => {
  const response = await request(app)
   .get('/launches')
   .expect('Content-Type', /json/)
   .expect(200)
 })
})

describe('Test POST /launches', () => {
 const completeLaunchData = {
  mission: 'HP MISSION',
  rocket: 'HP rocket',
  destination: 'Mars',
  launchDate: 'May 10, 2040',
 }
 const launchDataWithoutDate = {
  mission: 'HP MISSION',
  rocket: 'HP rocket',
  destination: 'Mars',
 }
 const launchDataWithInvalidDate = {
  mission: 'HP MISSION',
  rocket: 'HP rocket',
  destination: 'Mars',
  launchDate: 'May',
 }
 test('Response must be 201 created', async () => {
  const response = await request(app)
   .post('/launches')
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
   .post('/launches')
   .send(launchDataWithoutDate)
   .expect('Content-Type', /json/)
   .expect(404);
  expect(response.body).toStrictEqual({
   error: 'Missing required launch property !'
  })
 })
 test('Catch invalid dates', async () => {
  const response = await request(app)
   .post('/launches')
   .send(launchDataWithInvalidDate)
   .expect('Content-Type', /json/)
   .expect(400);
  expect(response.body).toStrictEqual({
   error: 'Invalid launch date'
  })
 })
})