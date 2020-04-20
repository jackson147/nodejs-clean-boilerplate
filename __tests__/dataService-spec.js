const makeDb = require('../db')
const makeDataService = require('../data/dataService')
const makeFakeData = require('./fixtures/fakeData')

describe('Contacts Repository', () => {
    let database
    let dataService

    beforeAll( async () => {
        database = await makeDb()
        dataService = makeDataService({ database })
    })

    afterAll( async () => {
        await database.client.close()
    })

    it('adds a data', async () => {
        const dummy = makeFakeData()
        const result = await dataService.add(dummy)

        expect(result.success).toBe(true)
        expect(result.created).toHaveProperty('dataId')
        expect(result.created).toEqual({
            ...dummy,
            dataId: result.created.dataId
        })
        return dataService.remove(dummy)
    })
})