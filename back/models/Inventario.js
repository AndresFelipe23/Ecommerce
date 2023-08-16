'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventarioSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    variedad: {type: Schema.ObjectId, ref: 'variedad', required: true},
    cantidad: {type: Number, require: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('inventario',InventarioSchema);