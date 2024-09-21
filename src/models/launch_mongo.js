const mongoose = require('mongoose')

const launchSchema = new mongoose.Schema({
 flightNumber: {
  type: Number,
  required: true
 },
 mission: {
  type: String,
  required: true
 },
 rocket: {
  type: String,
  required: true
 },
 launchDate: {
  type: Date,
  required: true
 },
 destination: {
  // type: mongoose.ObjectId,
  // ref: 'Planets'
  type: String,
  //required: true
 },
 upcoming: {
  type: Boolean,
  required: true
 },
 success: {
  type: Boolean,
  required: true,
  default: true
 },
 customers: [String]

})
// the name must be always singular or it 
// will considered as plural with lowercases
module.exports = mongoose.model('Launch', launchSchema)

