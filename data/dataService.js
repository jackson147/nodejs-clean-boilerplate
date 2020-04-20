const makeData = require('./data')

module.exports = function makeDataService({ database }){
    //Locks the methods so they cannot be changed.
    return Object.freeze({
        getData
    })

    async function getData ({ max = 100 } = {}) {

        let db = await database
        return (await db
            .collection('data')
            .find()
            .limit(Number(max))
            .toArray()).map(documentToData)
    }

    function documentToData ({ _id: dataId, ...doc }) {
        return makeData({ dataId, ...doc })
    }
}