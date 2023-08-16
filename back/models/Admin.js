'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = Schema({
    nombres: {type: String, required: true},
    apellidos: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    rol: {type: String, required: true},
});

module.exports =  mongoose.model('admin',AdminSchema);