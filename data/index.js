const makeDb = require('../db/index')
const makeDataService = require('./dataService')
const makeDataEndpointHandler = require('./dataEndpointHandler')

let database = makeDb()
let dataService =  makeDataService({ database })
module.exports = makeDataEndpointHandler({ dataService })