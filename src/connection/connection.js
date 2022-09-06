const { Pool } = require('pg');

async function getConnection(){
    const dbPool = new Pool({
        user: 'pddev',
        host: 'localhost',
        port: '5432',
        password: 'password',
        database: 'cont'
    });

    try{    
        return await dbPool.connect();
    }
    catch(err){
        console.log('Error in getConnection Func', err);
        throw new Error(err);
    }
}

module.exports = getConnection;