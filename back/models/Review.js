'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    venta: {type: Schema.ObjectId, ref: 'venta', required: true},
    review: {type: String, required: true},
    estrellas: {type: Number, required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('review',ReviewSchema);