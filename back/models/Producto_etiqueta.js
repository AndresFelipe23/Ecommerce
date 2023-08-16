'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Producto_etiquetaSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    etiqueta: {type: Schema.ObjectId, ref: 'etiqueta', required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('producto_etiqueta',Producto_etiquetaSchema);