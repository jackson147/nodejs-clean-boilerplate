const makeData = require('./data')

module.exports = function makeDataService({ database }){
    //Locks the methods so they cannot be changed.
    return Object.freeze({
        getData
    })

    async function getData ({ max = 100 } = {}) {
        //Database comes to service as a promise, must ensure it has been connected.
        let db = await database

        try {
            return (await db
                .collection('data')
                .find()
                .limit(Number(max))
                .toArray()).map(documentToData)
        }catch(err){
            throw new Error(`Failed to fetch data objects from database`)
        }
    }

    function documentToData ({ _id: dataId, ...doc }) {
        return makeData({ dataId, ...doc })
    }
}