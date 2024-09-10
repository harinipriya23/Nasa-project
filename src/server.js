const http = require('http')
const app = require('./app')
const { loadPlanetData } = require('./models/planets_models')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8000

const MONGO_URL = 'mongodb+srv://nasa:n1a2s3a4@cluster0.b0r8w.mongodb.net/?retryWrites=true&w=majority'

const server = http.createServer(app)

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready !')
})
mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL)
}
// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     })
//     console.log('mongodb connected')
//   } catch (err) {
//     console.error()
//     process.exit(1)
//      }
// }
   loadPlanetData();

  server.listen(PORT, () => {
    console.log(`server in ${PORT}`)
  })


// connectDB()
startServer()


