const { Pool } = require('pg');

async function getConnection(){
    const dbPool = new Pool({

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