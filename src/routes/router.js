const express = require('express');
const router = express.Router();
const service = require('../services/appService')
const jwtMiddleware = require('../utilities/jwtUtils');

router.post('/register', async (req, res, next) => {
    try{
        const response = await service.registerUser(req.body);
        res.status(200);
        res.json(response.message);
    }
    catch(err){
        console.log('Error in register', err);
        res.status(500);
        res.send('Cannot Register');
    }
});

router.post('/login', async (req, res, next) => {
    try{
        const response = await service.loginUser(req.body);
        res.status(response.status);
        res.json(response.message);
    }
    catch(err){
        console.log('Error in Login', err)
        res.status(500);
        res.send('Cannot Login!');
    }
});

router.post('/addContact', jwtMiddleware, async (req, res, next) => {
    try{
        const response = await service.insertContact(req.body);
        res.status(response.status);
        res.json(response.message);
    }
    catch(err){
        console.log('Error in addContact', err)
        res.status(500);
        res.send('Cannot add contact!');
    }
});

router.delete('/deleteContact', jwtMiddleware, async (req, res) =>{
    try{
        const response = await service.deleteContact(req.body);
        res.status(response.status);
        res.json(response.message);
    }
    catch(err){
        console.log('Error in deleting contact', err)
        res.status(500);
        res.send('Cannot delete contact!');
    }
});

router.patch('/editContact', jwtMiddleware, async (req, res) =>{
    try{
        const response = await service.editContact(req.body);
        res.status(response.status);
        res.json(response.message);
    }
    catch(err){
        console.log('Error in editing contact', err)
        res.status(500);
        res.send('Cannot edit contact!');
    }
});

router.get('/getContacts/:page/:ord/:userId', jwtMiddleware, async (req, res) =>{
    try{
        const tempBody = {page: Number(req.params.page), ord: req.params.ord, userId: Number(req.params.userId)}
        const response = await service.getContacts(tempBody);
        res.status(response.status);
        res.json(response.message);
    }
    catch(err){
        console.log('Error in getting contacts', err)
        res.status(500);
        res.send('Cannot get contacts!');
    }
})

router.get('/checkAvailability', async (req, res) =>{
    console.log('It is working fine!');
    res.status(200);
    res.send('Works Fine')
})

module.exports = router;