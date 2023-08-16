'use strict'

var express = require('express');
var CuponController = require('../controllers/CuponController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_cupon_admin',auth.auth,CuponController.registro_cupon_admin);
api.get('/listar_cupones_admin',auth.auth,CuponController.listar_cupones_admin);
api.get('/obtener_cupon_admin/:id',auth.auth,CuponController.obtener_cupon_admin);
api.put('/actualizar_cupon_admin/:id',auth.auth,CuponController.actualizar_cupon_admin);
api.delete('/eliminar_cupon_admin/:id',auth.auth,CuponController.eliminar_cupon_admin);
api.get('/validar_cupon_admin/:cupon',auth.auth,CuponController.validar_cupon_admin);

module.exports = api;