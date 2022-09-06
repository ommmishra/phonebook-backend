const dbService = require('../services/dbService');
const appServices = {};
const jwt = require('jsonwebtoken');

appServices.registerUser = async(bodyData)=>{
    try{
        const detailArr = [];
        if(!bodyData.firstName){
            return {status: 401, message: 'Invalid Request'};
        }
        detailArr.push(bodyData.firstName);

        if(!bodyData.lastName){
            return {status: 401, message: 'Invalid Request'};
        }
        detailArr.push(bodyData.lastName);

        if(!bodyData.email){
            return {status: 401, message: 'Invalid Request'};
        }
        detailArr.push(bodyData.email);

        if(!bodyData.password){
            return {status: 401, message: 'Invalid Request'};
        }
        detailArr.push(bodyData.password);

        const response = await dbService.registerUser(detailArr);
        const payLoad = { subject: response.first_name + response.last_name + response.email };
        const token = await jwt.sign(payLoad, 'secretStuff');
        return {token: token, message:{firstName: response.first_name, lastName: response.last_name}};
    }
    catch(err){
        console.log('Error while registering user', err);
        throw new Error(err);
    }
}

appServices.loginUser = async (bodyData)=>{
    try{
        if(!bodyData.password){
            return {status: 401, message: 'Invalid Request'};
        }
        const detailArr = [bodyData.email];
        const response = await dbService.loginUser(detailArr);
        if(!response.password){
            return {status: 401, message: 'Invalid Email'};
        }
        else{
            if(bodyData.password !== response.password){
                return {status: 401, message: 'Invalid Password'}
            }
            else{
                const payLoad = { subject: response.first_name + response.last_name + response.email };
                const token = await jwt.sign(payLoad, 'secretStuff');
                return {status: 200, message:{ userId: response.user_id, firstName: response.first_name, lastName: response.last_name, token: `Bearer ${token}` }};
            }
        }
    }
    catch(err){
        console.log('Error while logging user', err);
        throw new Error(err);
    }
}

appServices.insertContact = async (bodyData)=>{
    try{
        const detailArr = [];
        if(!bodyData.user_id){
            return {status: 401, message: 'Invalid Request'};
        }
        detailArr.push(bodyData.user_id)

        if(!bodyData.name){
            return {status: 401, message: 'Name Missing'};
        }
        detailArr.push(bodyData.name);

        if(!bodyData.phoneNumber || !/^\d{10}$/.test(bodyData.phoneNumber)){
            return {status: 401, message: 'Phone Number Missing'};
        }
        detailArr.push(bodyData.phoneNumber);

        if(bodyData.email){
            detailArr.push(bodyData.email);
        }
        else{
            detailArr.push('');
        }
        const response = await dbService.addContact(detailArr);
        return {status: 200, message:{ contactId: response.contact_id, name: response.name, phoneNumber: response.phone_number, email: response.email}};

    }
    catch(err){
        console.log('Error while adding contact', err);
        throw new Error(err);
    }
}

appServices.deleteContact = async (bodyData) =>{
    try {
        const detailArr = [];

        if(!bodyData.contactId){
            return {status: 401, message: 'Invalid Request'};
        }
        detailArr.push(bodyData.contactId);

        if(!bodyData.userId){
            return {status: 401, message: 'Invalid Request'};
        }
        detailArr.push(bodyData.userId);

        const response = await dbService.deleteContact(detailArr);
        return {status: 200, message: 'Contact Removed!'};

    } catch (err) {
        console.log('Error while adding contact', err);
        throw new Error(err);
    }
}

appServices.editContact = async (bodyData) =>{
    try{
        const detailObj = {};
        
        if(!bodyData.contactId){
            return {status: 401, message: 'Invalid Request'};
        }
        detailObj.contactId = bodyData.contactId;

        if(!bodyData.userId){
            return {status: 401, message: 'Invalid Request'};
        }
        detailObj.userId = bodyData.userId;

        if(bodyData.name && bodyData.name === ''){
            return {status: 401, message: 'Name cannot be empty!'}
        }
        detailObj.name = bodyData.name;

        if(bodyData.phoneNumber && bodyData.phoneNumber === ''){
            return {status: 401, message: 'Number cannot be empty!'}
        }
        detailObj.phoneNumber =  bodyData.phoneNumber;
        detailObj.email = bodyData.email;

        const response = await dbService.editContact(detailObj);
        return {status: 200, message: {contactId: response.contact_id, name: response.name, email: response.email, phoneNumber: response.phone_number}};
    }
    catch(err){
        console.log('Error while editing contact', err);
        throw new Error(err);
    }
}

appServices.getContacts = async (bodyData) =>{
    try{
        if(!bodyData.userId){
            return {status: 401, message: 'Invalid Request'}
        }
        const response = await dbService.getContacts([bodyData.userId]);
        if(response.length === 0){
            return {status: 200, message: null};
        }
        else{
            return {status: 200, message: response}
        }

    }
    catch(err){
        console.log('Error while fetching contacts', err);
        throw new Error(err);
    }
}
 
module.exports = appServices;