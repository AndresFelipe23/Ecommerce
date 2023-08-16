'use strict'

var express = require('express');
var clienteController = require('../controllers/ClienteController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_cliente_tienda',clienteController.registro_cliente_tienda);
api.get('/listar_clientes_tienda',auth.auth,clienteController.listar_clientes_tienda);

api.get('/listar_productos_destacados_publico',clienteController.listar_productos_destacados_publico);
api.get('/listar_productos_nuevos_publico',clienteController.listar_productos_nuevos_publico);
api.post('/registro_cliente',clienteController.registro_cliente);
api.post('/login_cliente',clienteController.login_cliente);
api.get('/obtener_cliente_guest/:id',auth.auth,clienteController.obtener_cliente_guest);
api.put('/actualizar_perfil_cliente_guest/:id',auth.auth,clienteController.actualizar_perfil_cliente_guest);
api.post('/registro_direccion_cliente',auth.auth,clienteController.registro_direccion_cliente);
api.get('/obtener_direccion_todos_cliente/:id',auth.auth,clienteController.obtener_direccion_todos_cliente);
api.put('/cambiar_direccion_principal_cliente/:id/:cliente',auth.auth,clienteController.cambiar_direccion_principal_cliente);
api.get('/eliminar_direccion_cliente/:id',auth.auth,clienteController.eliminar_direccion_cliente);


api.get('/listar_productos_publico',clienteController.listar_productos_publico);
api.get('/obtener_variedades_productos_cliente/:id',clienteController.obtener_variedades_productos_cliente);
api.get('/obtener_productos_slug_publico/:slug',clienteController.obtener_productos_slug_publico);
api.get('/listar_productos_recomendados_publico/:categoria',clienteController.listar_productos_recomendados_publico);

api.post('/agregar_carrito_cliente',auth.auth,clienteController.agregar_carrito_cliente);
api.get('/obtener_carrito_cliente/:id',auth.auth,clienteController.obtener_carrito_cliente);
api.delete('/eliminar_carrito_cliente/:id',auth.auth,clienteController.eliminar_carrito_cliente);
api.get('/obtener_ordenes_cliente/:id',auth.auth,clienteController.obtener_ordenes_cliente);
api.get('/obtener_detalles_ordenes_cliente/:id',auth.auth,clienteController.obtener_detalles_ordenes_cliente);
api.post('/emitir_review_producto_cliente',auth.auth,clienteController.emitir_review_producto_cliente);
api.get('/obtener_review_producto_cliente/:id',clienteController.obtener_review_producto_cliente);
api.get('/obtener_reviews_producto_publico/:id',clienteController.obtener_reviews_producto_publico);
api.post('/comprobar_carrito_cliente',auth.auth,clienteController.comprobar_carrito_cliente);
api.get('/consultarIDPago/:id',auth.auth,clienteController.consultarIDPago);
api.post('/registro_compra_cliente',auth.auth,clienteController.registro_compra_cliente);
api.get('/obtener_reviews_cliente/:id',auth.auth,clienteController.obtener_reviews_cliente);
api.post('/enviar_mensaje_contacto',clienteController.enviar_mensaje_contacto);

module.exports = api;