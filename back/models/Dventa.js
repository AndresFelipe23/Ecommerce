'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DventaSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    venta: {type: Schema.ObjectId, ref: 'venta', require: true},
    subtotal: {type: Number, require: true}, 
    variedad: {type: Schema.ObjectId, ref: 'variedad', require: true},
    cantidad: {type: Number, require: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('dventa',DventaSchema);