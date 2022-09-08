const dbConn = require('../connection/connection');
const dbService = {};

dbService.registerUser = async(detailArr)=>{
    let client = null;
    try{
        client = await dbConn();
        const response = await client.query('INSERT INTO phbook.users(user_name, email, password) VALUES ($1, $2, $3) RETURNING user_name, email, user_id', detailArr);
        // console.log('hueheuheuh',response);
        if(response.rowCount === 1){
            return response.rows[0]
        }
        else{
            console.log('User could not be added');
            throw new Error('Could not register user, dbService.registerUser');
        }
    }
    catch(err){
        console.log('Error in dbService.registerUser', err);
        throw new Error(err)
    }
    finally{
        await client.end();
    }
}

dbService.loginUser = async (details)=>{
    let client = null;
    try{
        client = await dbConn();
        const response = await client.query('SELECT email, password, user_name, user_id FROM phbook.users WHERE email = $1;', details);
        if(response.rowCount === 1){
            return response.rows[0]; 
        }
        else{
            return {};
        }
    }
    catch(err){
        console.log('Error in dbService, dbService.loginUser');
        throw new Error(err);
    }
    finally{
        if(client){
            await client.end();
        }    
    }
}

dbService.addContact = async (details)=>{
    let client = null;
    try{
        client = await dbConn();
        const response = await client.query('INSERT INTO phbook.contacts(user_id, name, phone_number, email) VALUES ($1, $2, $3, $4) RETURNING contact_id, name, email, phone_number;', details)
        if(response.rowCount === 1){
            return response.rows[0]
        }
        else{
            console.log('Contact could not be added');
            throw new Error('Could not register user, dbService.registerUser');
        }
    }
    catch(err){
        console.log('Error in dbService, dbService.addContact');
        throw new Error(err);
    }
    finally{
        if(client){
            await client.end();
        }
    }
}

dbService.deleteContact = async (details) => {
    let client = null;
    try{
        client = await dbConn();
        const response = await client.query('DELETE FROM phbook.contacts WHERE contact_id = $1 and user_id =$2;', details);
        if(response.rowCount === 1){
            return response.rows[0];
        }
        else{
            console.log('Contact was not updated');
            throw new Error('Could not delete contact');
        }
    }
    catch(err){
        console.log('Error in dbService, dbService.deleteContact', err);
        throw new Error(err);
    }
    finally{
        if(client){
            await client.end();
        }    
    }
}

dbService.editContact = async (editDetails)=>{
    let client = null;
    try{
        let query = `UPDATE phbook.contacts SET `
        if(editDetails.name){
            query += `name = '${editDetails.name}' `;
        }
        if(editDetails.phoneNumber){
            query += `phone_number = '${editDetails.phoneNumber}' `;
        }
        if(editDetails.email){
            query += `email = '${editDetails.email}' `;
        }
        query += `WHERE contact_id = ${editDetails.contactId} and user_id = ${editDetails.userId} RETURNING contact_id, name, email, phone_number;`

        client = await dbConn();
        const response = await client.query(query);

        if(response.rowCount === 1){
            return response.rows[0];
        }
        else{
            console.log('Contact was not updated');
            throw new Error('Could not update contacts');
        }
    }
    catch(err){
        console.log('Error in dbService, dbService.editContact', err);
        throw new Error(err);
    }
    finally{
        if(client){
            await client.end();
        }
    }
}

dbService.getContacts = async (details) => {
    let client = null;
    try{
        client = await dbConn();
        const response = await client.query(`SELECT contact_id, name, email, phone_number FROM phbook.contacts WHERE user_id = ${details[0]} ORDER BY NAME ${details[1]} LIMIT 20 OFFSET ${details[2]};`);
        const countResponse = await client.query(`SELECT COUNT(*) FROM phbook.contacts WHERE user_id = ${details[0]};`)
        console.log(`SELECT contact_id, name, email, phone_number FROM phbook.contacts WHERE user_id = ${details[0]} ORDER BY NAME ${details[1]} LIMIT 20 OFFSET ${details[2]};`)
        if(response.rowCount > 0){
            return {items: response.rows, total_count: countResponse.rows[0].count};
        }
        else{
            return [];
        }
    }
    catch(err){
        console.log('Error in dbService, dbService.getContacts', err);
        throw new Error(err);
    }
    finally{
        if(client){
            await client.end();
        }
    }
}

module.exports = dbService;