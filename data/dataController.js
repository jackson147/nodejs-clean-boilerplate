const adaptRequest = require('../helpers/adapt-request')
const handleDataRequest = require('.')

module.exports = function dataController(req, res) {
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
        console.error(e)
        res.status(500).end()
    })
}