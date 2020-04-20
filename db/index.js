const mongodb = require('mongodb')
const waitPort = require('wait-port')

const params = {
    host: '127.0.0.1',
    port: 27017,
    db: 'test'
};

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
        const url = `mongodb://${params.host}:${params.port}`
        client = new MongoClient(url)
        let open = await waitPort(params)
        console.log(`Waiting for ${params.port} to open...`)
        if(open){
            console.debug(`Port ${params.port} open, attempting to connect to mongodb server...`)
            await client.connect()
        }else{
            throw new Error(`Could not connect to MongoDB, port ${params.port} not open`)
        }
        db = await client.db(params.db)
        db.makeId = makeIdFromString
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