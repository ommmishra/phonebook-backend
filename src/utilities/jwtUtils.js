const jwt = require('jsonwebtoken');

function jwtmiddleWare(req, res, next) {
    console.log('middleware',req.headers);
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized Request!');
    }
    
    let token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).send('Unauthorized Request!');
    }
    else{

        let authVal = null;
        try{
            authVal = jwt.verify(token, 'secretStuff');
        }
        catch(err){
            // res.status(401)
            // res.send('Unauthorized Request!');
            console.log('jwt Error', err)
        }
        if(!authVal){
            return res.status(401).send('Unauthorized Request!');
        }
    }
    
    next()
}

module.exports = jwtmiddleWare