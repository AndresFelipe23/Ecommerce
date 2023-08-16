'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    cantidad: {type: Number, require: true},
    variedad: {type: Schema.ObjectId, ref: 'variedad', required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('carrito',CarritoSchema);