const makeData = require('./data')
const UniqueConstraintError = require('../helpers/errors').UniqueConstraintError

const collectionName = "data"

module.exports = function makeDataService({ database }){
    //Locks the methods so they cannot be changed.
    return Object.freeze({
        getData,
        findById,
        add,
        remove
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
                .collection(collectionName)
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
            .collection(collectionName)
            .findOne({ _id: db.makeId(dataId) })
        if (found) {
            return documentToData(found)
        }
        return null
    }

    async function add ({ dataId, ...data }) {
        const db = await database
        if (dataId) {
            data._id = db.makeId(dataId)
        }
        const { result, ops } = await db
            .collection(collectionName)
            .insertOne(data)
        return {
            success: result.ok === 1,
            created: documentToData(ops[0])
        }
    }

    async function remove ({ dataId, ...data }) {
        const db = await database
        if (dataId) {
            data._id = db.makeId(dataId)
        }

        const { result } = await db.collection(collectionName).deleteMany(data)
        return result.n
    }


    function documentToData ({ _id: dataId, ...doc }) {
        return makeData({ dataId, ...doc })
    }
}