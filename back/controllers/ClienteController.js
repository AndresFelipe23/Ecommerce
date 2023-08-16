var Cliente = require('../models/Cliente');
var Carrito = require('../models/Carrito');
var Variedad = require('../models/Variedad');
var Venta = require('../models/Venta');
var Dventa = require('../models/Dventa');
var Review = require('../models/Review');
var Contacto = require('../models/Contacto');
var Direccion = require('../models/Direccion');
var Producto_etiqueta = require('../models/Producto_etiqueta');
var bcrypt = require('bcrypt-nodejs');
var Producto = require('../models/Producto');
var jwt = require('../helpers/jwt');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');

registro_cliente_tienda = async function(req,res){
    let data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({email:data.email});

    if(clientes_arr.length == 0){
        if(data.password){
            bcrypt.hash(data.password,null,null, async function(err,hash){
                if(hash){
                    data.dni = '';
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'ErrorServer',data:undefined});
                }
            })
        }else{
            res.status(200).send({message:'No hay una contraseña',data:undefined});
        }

        
    }else{
        res.status(200).send({message:'El correo ya existe, intente con otro.',data:undefined});
    }
}

listar_clientes_tienda = async function(req,res){
    if(req.user){
        var clientes = await Cliente.find();
        res.status(200).send({data:clientes});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}


/**** */

const listar_productos_destacados_publico = async function(req,res){
    let reg = await Producto_etiqueta.find({etiqueta:"61a390d39b40d02e0cb9d789"}).populate('producto');
    res.status(200).send({data: reg});
}

const listar_productos_nuevos_publico = async function(req,res){
    let reg = await Producto.find({estado: 'Publicado'}).sort({createdAt:-1}).limit(8);
    res.status(200).send({data: reg});
}

const registro_cliente = async function(req,res){
    //
    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({email:data.email});
    console.log(data);
    if(clientes_arr.length == 0){
        if(data.password){
            bcrypt.hash(data.password,null,null, async function(err,hash){
                if(hash){
                    data.dni = '';
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'ErrorServer',data:undefined});
                }
            })
        }else{
            res.status(200).send({message:'No hay una contraseña',data:undefined});
        }

        
    }else{
        res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined});
    }
}

const login_cliente = async function(req,res){
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email:data.email});

    if(cliente_arr.length == 0){
        res.status(200).send({message: 'No se encontro el correo', data: undefined});
    }else{
        //LOGIN
        let user = cliente_arr[0];
        bcrypt.compare(data.password, user.password, async function(error,check){
            if(check){

                if(data.carrito.length >= 1){
                    for(var item of data.carrito){
                        await Carrito.create({
                            cantidad:item.cantidad,
                            producto:item.producto._id,
                            variedad:item.variedad.id,
                            cliente:user._id
                        });
                    }
                }

                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'La contraseña no coincide', data: undefined}); 
            }
        });
 
    } 
}

const obtener_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            var reg = await Cliente.findById({_id:id});

            res.status(200).send({data:reg});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_perfil_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var data = req.body;

        if(data.password){
            console.log('Con contraseña');
            bcrypt.hash(data.password,null,null, async function(err,hash){
                console.log(hash);
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono :data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    password: hash,
                });
                res.status(200).send({data:reg});
            });
            
        }else{
            console.log('Sin contraseña');
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono :data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
            });
            res.status(200).send({data:reg});
        }
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const registro_direccion_cliente  = async function(req,res){
    if(req.user){
        var data = req.body;

        if(data.principal){
            let direcciones = await Direccion.find({cliente:data.cliente});

            direcciones.forEach(async element => {
                await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
            });
        }
        
        let reg = await Direccion.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_direccion_todos_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let direcciones = await Direccion.find({cliente:id,status:true}).populate('cliente').sort({createdAt:-1});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const cambiar_direccion_principal_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var cliente = req.params['cliente'];

        let direcciones = await Direccion.find({cliente:cliente});

        direcciones.forEach(async element => {
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
        });

        await Direccion.findByIdAndUpdate({_id:id},{principal:true});
 
        res.status(200).send({data:true});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_direccion_cliente = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let direcciones = await Direccion.findByIdAndUpdate({_id:id},{status:false});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

//---METODOS PUBLICOS----------------------------------------------------

const listar_productos_publico = async function(req,res){
    let arr_data = [];
    let reg = await Producto.find({estado:'Publicado'}).sort({createdAt:-1});

    for(var item of reg){
        let variedades = await Variedad.find({producto:item._id});
        arr_data.push({
            producto: item,
            variedades: variedades
        });
    }

    res.status(200).send({data: arr_data});
}

const obtener_variedades_productos_cliente = async function(req,res){
    let id = req.params['id'];
    let variedades = await Variedad.find({producto:id});
    res.status(200).send({data:variedades});
}

const obtener_productos_slug_publico = async function(req,res){
    var slug = req.params['slug'];
    try {
        let producto = await Producto.findOne({slug: slug,estado:'Publicado'});
        if(producto == undefined){
            res.status(200).send({data:undefined});
        }else{
            res.status(200).send({data:producto});
        }
    } catch (error) {
        res.status(200).send({data:undefined});
    }
}


const listar_productos_recomendados_publico = async function(req,res){
    var categoria = req.params['categoria'];
    let reg = await Producto.find({categoria: categoria,estado:'Publicado'}).sort({createdAt:-1}).limit(8);
    res.status(200).send({data: reg});
}

const agregar_carrito_cliente = async function(req,res){
    if(req.user){
        let data = req.body;

        let variedad = await Variedad.findById({_id:data.variedad});

        if(data.cantidad <= variedad.stock){
            let reg = await Carrito.create(data);
            res.status(200).send({data:reg});
        }else{
            res.status(200).send({data:undefined,message: 'Stock insuficiente, ingrese otra cantidad'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_carrito_cliente = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        let carrito_cliente = await Carrito.find({cliente:id}).populate('producto').populate('variedad');
        res.status(200).send({data:carrito_cliente});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_carrito_cliente = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let reg = await Carrito.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_ordenes_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
     
        let reg = await Venta.find({cliente:id}).sort({createdAt:-1});
        res.status(200).send({data:reg});   
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const enviar_email_pedido_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'diegoalonssoac@gmail.com',
                pass: 'dcmplvjviofjojgf'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_pedido.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'diegoalonssoac@gmail.com',
                to: orden.cliente.email,
                subject: 'Gracias por tu orden, Prágol.',
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
} 


const obtener_detalles_ordenes_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({venta:venta._id}).populate('producto').populate('variedad');
            res.status(200).send({data:venta,detalles:detalles});

        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined});
        }
            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const emitir_review_producto_cliente  = async function(req,res){
    if(req.user){
        let data = req.body;
        let reg = await Review.create(data);
        res.status(200).send({data:reg});

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_review_producto_cliente  = async function(req,res){
    let id = req.params['id'];
    let reg = await Review.find({producto:id}).sort({createdAt:-1});
    res.status(200).send({data:reg});
}

const obtener_reviews_producto_publico = async function(req,res){
    let id = req.params['id'];

    let reviews = await Review.find({producto:id}).populate('cliente').sort({createdAt:-1});
    res.status(200).send({data: reviews});
}


const comprobar_carrito_cliente = async function(req,res){
    if(req.user){
        try {
            var data = req.body;
            var detalles = data.detalles;
            let access = false;
            let producto_sl = '';

            for(var item of detalles){
                let variedad = await Variedad.findById({_id:item.variedad}).populate('producto');
                if(variedad.stock < item.cantidad){
                    access = true;
                    producto_sl = variedad.producto.titulo;
                }
            }

            if(!access){
                res.status(200).send({venta:true});
            }else{
                res.status(200).send({venta:false,message:'Stock insuficiente para ' + producto_sl});
            }
        } catch (error) {
            console.log(error);
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const consultarIDPago = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var ventas = await Venta.find({transaccion:id});
        res.status(200).send({data:ventas});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_compra_cliente = async function(req,res){
    if(req.user){

        var data = req.body;
        var detalles = data.detalles;

        data.estado = 'Procesando';

        let venta = await Venta.create(data);

        for(var element of detalles){
            element.venta = venta._id;
            await Dventa.create(element);

            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });

            //limpiar carrito
            await Carrito.remove({cliente:data.cliente});
        }

        enviar_orden_compra(venta._id);

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_reviews_cliente  = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let reg = await Review.find({cliente:id}).populate('cliente').populate('producto');
        res.status(200).send({data:reg});

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const enviar_mensaje_contacto  = async function(req,res){
    let data = req.body;

    data.estado = 'Abierto';
    let reg = await Contacto.create(data);
    res.status(200).send({data:reg});

}

const enviar_orden_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'diegoalonssoac@gmail.com',
                pass: 'dcmplvjviofjojgf'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_compra.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'diegoalonssoac@gmail.com',
                to: orden.cliente.email,
                subject: 'Confirmación de compra ' + orden._id,
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
} 


module.exports = {
    registro_cliente_tienda,
    listar_clientes_tienda,
    listar_productos_destacados_publico,
    listar_productos_nuevos_publico,
    registro_cliente,
    login_cliente,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente,
    eliminar_direccion_cliente,
    listar_productos_publico,
    obtener_variedades_productos_cliente,
    obtener_productos_slug_publico,
    listar_productos_recomendados_publico,
    agregar_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente,
    obtener_ordenes_cliente,
    obtener_detalles_ordenes_cliente,
    emitir_review_producto_cliente,
    obtener_review_producto_cliente,
    obtener_reviews_producto_publico,
    comprobar_carrito_cliente,
    consultarIDPago,
    registro_compra_cliente,
    obtener_reviews_cliente,
    enviar_mensaje_contacto
}