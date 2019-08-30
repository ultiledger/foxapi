const network = require('./network')
const exchanges = require('./exchanges')
module.exports = (app) => {
  app.use('/v2/network', network)
  app.use('/v2/exchanges', exchanges)
}