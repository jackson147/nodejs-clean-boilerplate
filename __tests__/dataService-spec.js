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

    it('removes a data', async () => {
        const dummy = makeFakeData()
        await dataService.add(dummy)
        expect(await dataService.remove(dummy)).toBe(1)
    })

    it('removes multiple data', async () => {
        const fake1 = dataService.add(makeFakeData())
        const fake2 = dataService.add(makeFakeData())
        const fake3 = dataService.add(makeFakeData())
        const fakes = await Promise.all([fake1, fake2, fake3])
        
        await dataService.remove({})
        const items = await dataService.getData()
        expect(items.length).toBe(0)
    })

    it('lists data', async () => {
        const fake1 = dataService.add(makeFakeData())
        const fake2 = dataService.add(makeFakeData())
        const fake3 = dataService.add(makeFakeData())
        const fakes = await Promise.all([fake1, fake2, fake3])
        const items = await dataService.getData()
        expect(items.length).toBe(3)
        await Promise.all(fakes.map(({ created }) => dataService.remove(created)))
    })

    it('supports limits', async () => {
        const fake1 = dataService.add(makeFakeData())
        const fake2 = dataService.add(makeFakeData())
        const fake3 = dataService.add(makeFakeData())
        const fakes = await Promise.all([fake1, fake2, fake3])
        const items = await dataService.getData({ max: 2 })
        expect(items.length).toBe(2)
        return Promise.all(fakes.map(({ created }) => dataService.remove(created)))
    })

    it('pages forward', async () => {
        const fake1 = dataService.add(makeFakeData())
        const fake2 = dataService.add(makeFakeData())
        const fake3 = dataService.add(makeFakeData())
        const fakes = await Promise.all([fake1, fake2, fake3])
        const items = await dataService.getData({
            after: fakes[0].created.dataId
        })
        expect(items.length).toBe(2)
        return Promise.all(fakes.map(({ created }) => dataService.remove(created)))
    })

    it('pages backward', async () => {
        const fake1 = dataService.add(makeFakeData())
        const fake2 = dataService.add(makeFakeData())
        const fake3 = dataService.add(makeFakeData())
        const fakes = await Promise.all([fake1, fake2, fake3])
        const items = await dataService.getData({
            before: fakes[1].created.dataId
        })
        expect(items.length).toBe(1)
        return Promise.all(fakes.map(({ created }) => dataService.remove(created)))
    })

    it('finds a contact by id', async () => {
        const dummy = makeFakeData()
        const { created } = await dataService.add(dummy)
        const result = await dataService.findById(created)
        expect(result).toEqual({
            ...dummy,
            dataId: created.dataId
        })
        return dataService.remove(dummy)
    })
})