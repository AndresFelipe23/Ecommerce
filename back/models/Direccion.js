'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DireccionSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    nombres: {type: String, required: true},
    apellidos: {type: String, required: true},
    dni: {type: String, required: true},
    telefono: {type: String, required: true},
    direccion: {type: String, required: true},
    referencia: {type: String, required: false},

    pais: {type: String, required: true},
    region: {type: String, required: false},
    provincia: {type: String, required: false},
    distrito: {type: String, required: false},

    zona: {type: String, required: true},
    zip: {type: String, required: false},
    
    status: {type: Boolean,default: true, required: false},
    
    principal: {type: Boolean, required: true},
    createdAt: {type:Date, default: Date.now, required: true}
});

module.exports =  mongoose.model('direccion',DireccionSchema);