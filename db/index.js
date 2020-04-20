const mongodb = require('mongodb')
const waitPort = require('wait-port')
const dbConfig = require('./config.json')

let client;
let db;

module.exports = makeDb

async function makeDb(){
    //Are we already connected?
    if(isConnected()){
        console.debug("Database already connected...")
        return db
    }

    try{
        const MongoClient = mongodb.MongoClient
        const url = `mongodb://${dbConfig.host}:${dbConfig.port}`
        client = new MongoClient(url)
        let open = await waitPort(dbConfig)
        console.log(`Waiting for ${dbConfig.port} to open...`)
        if(open){
            console.debug(`Port ${dbConfig.port} open, attempting to connect to mongodb server...`)
            await client.connect()
        }else{
            throw new Error(`Could not connect to MongoDB, port ${dbConfig.port} not open`)
        }
        db = await client.db(dbConfig.db)
        db.makeId = makeIdFromString
        db.client = client
        return db
    }catch(err){
        console.error(err)
        throw new Error('Failed to connect to mongodb server!')
    }
}

function makeIdFromString (id) {
    return new mongodb.ObjectID(id)
}

function isConnected() {
    return !!client && !!client.topology && client.topology.isConnected()
}