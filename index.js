const port = 8080
const express = require('express')
const bodyParser = require('body-parser')

const dataController = require('./data/dataController')

app = express()
app.use(bodyParser.json())

app.get('/', dataController)

app.listen(8080, () => console.log(`Listening on port ${port}`))