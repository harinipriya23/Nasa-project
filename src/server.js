const http = require('http')
const app = require('./app')
const { loadPlanetData } = require('./models/planets_models')
const PORT = process.env.PORT || 3000

const server = http.createServer(app)

async function startServer() {
  await loadPlanetData();

  server.listen(PORT, () => {
    console.log(`server in ${PORT}`)
  })


}
startServer()


