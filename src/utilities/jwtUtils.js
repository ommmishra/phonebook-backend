const jwt = require('jsonwebtoken');

function jwtmiddleWare(req, res, next) {
    if(!req.headers.authorization) {
        res.status(401)
        res.send('Unauthorized Request!');
    }

    let token = req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(401)
        res.send('Unauthorized Request!');
    }

    let authVal = null;
    try{
        authVal = jwt.verify(token, 'secretStuff');
    }
    catch(err){
        res.status(401)
        res.send('Unauthorized Request!');
    }
    if(!authVal){
        res.status(401)
        res.send('Unauthorized Request!');
    }
    
    next()
}

module.exports = jwtmiddleWare