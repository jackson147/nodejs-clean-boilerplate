const errors = require('../helpers/errors')
const makeHttpError = require('../helpers/http-error')
const makeData = require('./data')

module.exports = function makeDataEndpointHandler({ dataService }){
    return async function handle (httpRequest) {
        switch(httpRequest.method){
            case 'GET':
                return getData(httpRequest)
            case 'POST':
                return postData(httpRequest)
            default:
                return makeHttpError({
                    statusCode: 405,
                    errorMessage: `${httpRequest.method} method not allowed`
                })
        }
    }

    async function getData(httpRequest){
        const { id } = httpRequest.pathParams || {}
        const { max, before, after } = httpRequest.queryParams || {}
    
        const result = id
          ? await dataService.findById({ dataId: id })
          : await dataService.getData({ max, before, after })

        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 200,
            data: JSON.stringify(result)
        }
    }

    async function postData (httpRequest) {
        let postBody = httpRequest.body
        if (!postBody) {
            return makeHttpError({
            statusCode: 400,
            errorMessage: 'Bad request. No POST body.'
            })
        }

        if (typeof httpRequest.body === 'string') {
            try {
                postBody = JSON.parse(postBody)
            } catch {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: 'Bad request. POST body must be valid JSON.'
                })
            }
        }

        try {
            const data = makeData(postBody)
            const result = await dataService.add(data)
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 201,
                data: JSON.stringify(result)
            }
        } catch (e) {
            return makeHttpError({
            errorMessage: e.message,
            statusCode:
                e instanceof errors.UniqueConstraintError
                ? 409
                : e instanceof errors.InvalidPropertyError ||
                    e instanceof errors.RequiredParameterError
                    ? 400
                    : 500
            })
        }
    }
}