const npmConfig = require('./package.json')
const config = require('./config.json')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//Define middleware
app.use(bodyParser.json())

//Import controllers for different data types
const dataController = require('./data/dataController')

//Generic routes
app.get('/', (req, res) => res.json({
    name :  npmConfig["display-name"],
    version : npmConfig.version
}))

//Add routes for each of the controllers
app.all('/data', dataController)
app.get('/data/:id', dataController)

//Listen on port supplied in config file
app.listen(config.port, () => console.log(`Listening on port ${config.port}`))