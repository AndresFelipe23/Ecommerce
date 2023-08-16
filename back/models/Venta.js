'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentaSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    subtotal: {type: Number, require: true},
    total_pagar: {type: Number, require: true},
    currency: {type: String, require: true},
    tracking: {type: String,default: '', require: true},
    envio_precio: {type: Number, require: true},
    transaccion: {type: String, require: true},
    cupon: {type: String, require: false},
    metodo_pago: {type: String, require: true},
    estado: {type: String, require: true},
    tipo_descuento: {type: String, require: false},
    valor_descuento: {type: String, require: false},
    direccion: {type: Schema.ObjectId, ref: 'direccion', require: true},
    nota: {type: String, require: false},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('venta',VentaSchema);