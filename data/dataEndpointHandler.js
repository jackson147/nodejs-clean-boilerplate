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
        const result = await dataService.getData()        
        return {
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 200,
            data: JSON.stringify(result)
        }
    }
}