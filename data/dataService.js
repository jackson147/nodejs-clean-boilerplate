const makeData = require('./data')

module.exports = function makeDataService({ database }){
    //Locks the methods so they cannot be changed.
    return Object.freeze({
        getData,
        findById
    })

    async function getData ({ max = 100, before, after } = {}) {
        //Database comes to service as a promise, must ensure it has been connected.
        let db = await database

        const query = {}
        if (before || after) {
            query._id = {}
            query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id
            query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id
        }
        
        // console.debug(query)

        try {
            return (await db
                .collection('data')
                .find(query)
                .limit(Number(max))
                .toArray()).map(documentToData)
        }catch(err){
            throw new Error(`Failed to fetch data objects from database`)
        }
    }

    async function findById ({ dataId }) {
        const db = await database
        const found = await db
            .collection('data')
            .findOne({ _id: db.makeId(dataId) })
        if (found) {
            return documentToData(found)
        }
        return null
    }
    

    function documentToData ({ _id: dataId, ...doc }) {
        return makeData({ dataId, ...doc })
    }
}