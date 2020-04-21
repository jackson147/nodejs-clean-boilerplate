const makeDb = require('../db')

describe('Data Endpoint', () => {

    //Not nice, but `jest` breaks a bit if we don't set the DB connection up and wait for it properly.
    let database
    let handleDataRequest

    beforeAll( async () => {
        database = await makeDb()
        handleDataRequest = require('../data/index')
    })

    afterAll( async () => {
        await database.client.close()
    })

    it('Will NOT create a data without a userId', async () => {
        const result = await handleDataRequest({
            method: 'POST',
            body: JSON.stringify({
                id: 3,
                title: 'oaisjdoasud0'
            })
        })
        expect(result).toEqual({
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 400,
            data: JSON.stringify({
                success: false,
                error: 'userId can not be null or undefined.'
            })
        })
    })

    it('Will NOT create a data without an id', async () => {
        const result = await handleDataRequest({
            method: 'POST',
            body: JSON.stringify({
                userId: 3,
                title: 'oaisjdoasud0'
            })
        })
        expect(result).toEqual({
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 400,
            data: JSON.stringify({
                success: false,
                error: 'id can not be null or undefined.'
            })
        })
    })
    it('Will NOT create a data without a title', async () => {
        const result = await handleDataRequest({
            method: 'POST',
            body: JSON.stringify({
                userId: 3,
                id: 3
            })
        })
        expect(result).toEqual({
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 400,
            data: JSON.stringify({
                success: false,
                error: 'title can not be null or undefined.'
            })
        })
    })

    it('Will create a data with extra data', async () => {
        const result = await handleDataRequest({
            method: 'POST',
            body: JSON.stringify({
                userId: 3,
                id: 3,
                title : 'oijsadoijasd897'
            })
        })
        expect(result).toEqual({
            headers: {
                'Content-Type': 'application/json'
            },
            statusCode: 201,
            data: JSON.stringify({
                success: true,
                created: {
                    //Hacky...
                    dataId: JSON.parse(result.data).created.dataId,
                    userId: 3,
                    id: 3,
                    title : 'oijsadoijasd897'
                }
            })
        })
    })
})
