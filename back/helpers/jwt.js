'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'pragol2021Monithor';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(1,'day').unix()
    }

    return jwt.encode(payload,secret);
}