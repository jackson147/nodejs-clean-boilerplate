const adaptRequest = require('../helpers/adapt-request')
const handleDataRequest = require('.')

module.exports = function dataController(req, res) {
    //Converts request to our own object type, decouples from express
    const httpRequest = adaptRequest(req)
    //Handle the request
    handleDataRequest(httpRequest)
    .then(({ headers, statusCode, data }) =>
        res
        .set(headers)
        .status(statusCode)
        .send(data)
    )
    .catch(e => {
        console.debug("Something went wrong obtaining data...")
        console.error(e)
        res.status(500).end()
    })
}