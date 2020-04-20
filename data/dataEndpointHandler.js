const makeHttpError = require('../helpers/http-error')

module.exports = function makeDataEndpointHandler({ dataService }){
    return async function handle (httpRequest) {
        switch(httpRequest.method){
            case 'GET':
                return getData(httpRequest)
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
}