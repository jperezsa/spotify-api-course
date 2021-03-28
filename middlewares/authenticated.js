'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_'


exports.ensureAuth = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(403).send({message : 'Not Valid Request'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){

            return res.status(401).send({message : 'Expired Token'});

        }
    }catch(ex) {
        console.log(ex)
        return res.status(403).send({message : 'Not Valid Token'});
    }

    req.user = payload;

    next();
}