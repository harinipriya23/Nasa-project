const http = require('http')
const app = require('./app')

const { mongoConnect } = require('./services/mongo')
const { loadPlanetData } = require('./models/planets_models')

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

async function startServer() {

  await mongoConnect()

  await loadPlanetData();

  console.log(server)
  server.listen(PORT, () => {
    console.log(`server in ${PORT}`)
  })
}
startServer()


