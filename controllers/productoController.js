
import Producto from "../models/Producto.js";
import Usuario from "../models/Usuario.js";

//Obtener Los productos
const obtenerProductos = async (req, res) => {
    const productos = await Producto.find({
        '$or' : [
            {'colaboradores' : {$in : req.usuario}},
            {'creador' : {$in : req.usuario}},

        ]
    }).select('-clientes')
    res.json(productos);
}


//Crear nuevos Productos
const nuevoProducto = async (req, res) => {
    console.log("Desde la funcion 'nuevoProducto' en el archivo productoController.js...");

    const producto = new Producto(req.body);
    console.log("el valor de producto en la funcion nuevoProducto", producto);
    producto.creador = req.usuario._id

    try {
        const productoAlmacenado = await producto.save();
        res.json(productoAlmacenado);
    } catch (error) {
        console.log("ERROR en la funcion 'nuevoProducto' en el archivo productoController.js...");
        console.log("El error es -->",error);
    }
}

//Listar un producto y las utilidades asociadas a el 
const obtenerProducto = async (req, res) => {
    
    console.log("Desde la funcion 'obtenerProducto' en el archivo productoController.js...");

    //Consideraciones de que existe el producto - START
    const { id, _id } = req.params;
    const producto = await Producto.findById(id).populate({ path : 'clientes', populate : {path: 'completado', select: "nombre"}}).populate("colaboradores", "nombre email") ;
    //
    if(!producto) {
        console.log("Validacion para ver si no existe ese producto");
        const error = new Error("Producto no encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(
        producto.creador.toString() !== req.usuario._id.toString() && 
        !producto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())
    ){
        const error = new Error("Acción no Válida");
        return res.status(403).json({msg: error.message});
    }

    //Obtener las tareas del Proyecto
    //const clientes = await Cliente.find().where("producto").equals(producto._id);

    
    res.json(producto);

    
}

//Editar un producto
const editarProducto = async (req, res) => {
    console.log("Desde la funcion 'editarProducto' en el archivo productoController.js...");

    //Consideraciones de que existe el producto - START
    const { id } = req.params;
    const producto = await Producto.findById(id);
    console.log("linea 53", producto);
    if(!producto) {
        const error = new Error("Producto no encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(producto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no Válida");
        return res.status(403).json({msg: error.message});
    }
    //Consideraciones de que existe el producto - END

    producto.nombre = req.body.nombre || producto.nombre;
    producto.descripcion = req.body.descripcion || producto.descripcion;
    producto.fechaEntrega = req.body.fechaEntrega || producto.fechaEntrega;
    producto.marca = req.body.marca || producto.marca;

    try {
        const productoAlmacenado = await producto.save();
        res.json(productoAlmacenado)
    } catch (error) {
        console.log("Error en la funcion 'editarProducto' en el archivo productoController.js... el error es el siguiente:");
        console.log(error);
    }
}

//Eliminar un producto
const eliminarProducto = async (req, res) => {
    console.log("Desde la funcion 'eliminarProducto' en el archivo productoController.js...");

    //Consideraciones de que existe el producto - START
    const { id, _id } = req.params;
    const producto = await Producto.findById(id);
    console.log("linea 98", producto);
    if(!producto) {
        const error = new Error("Producto no encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(producto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no Válida");
        return res.status(403).json({msg: error.message});
    }

    // const productoID = await Producto.findById(_id);
    // if(!productoID) {
    //     console.log("Linea 111-Validacion para ver si no existe ese productoID");
    //     const error = new Error("Producto no encontrado");
    //     return res.status(404).json({msg: error.message});
    // }
    //Consideraciones de que existe el producto - END
    

    try {
        await producto.deleteOne();
        res.json({ msg: "Producto Eliminado"})
    } catch (error) {
        console.log("Error en la funcion 'eliminarProducto' en el archivo productoController.js... en el error es el siguiente:");
        console.log(error);
    }
}


//Agregar un producto
const buscarColaborador = async (req, res) => {
    const {email} = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if(!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({msg: error.message})
    }
    res.json(usuario)
}

//Agregar un producto
const agregarColaborador = async (req, res) => {
    const producto = await Producto.findById(req.params.id);

    if(!producto) {
        const error = new Error("Producto no Encontrado");
        return res.status(404).json({ msg : error.message})
    }

    if(producto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg : error.message})
    }
    //
    const {email} = req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if(!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({msg: error.message})
    }

    //El colaborador no es el admin del producto
    if(producto.creador.toString() === usuario._id.toString()){
        const error = new Error("El Administrador del Producto no puede ser colaborador");
        return res.status(404).json({msg: error.message})
    }
    //Revisar que no este ya agregado al producto
    if(producto.colaboradores.includes(usuario._id)){
        const error = new Error("El usuario ya es colaborador del Producto");
        return res.status(404).json({msg: error.message})
    }

    //Esta bien, se puede agregar
    producto.colaboradores.push(usuario._id);
    await producto.save()
    res.json({ msg: "Colaborador Agregado correctamente"})

}


//Eliminar un producto
const eliminarColaborador = async (req, res) => {
    const producto = await Producto.findById(req.params.id);

    if(!producto) {
        const error = new Error("Producto no Encontrado");
        return res.status(404).json({ msg : error.message})
    }

    if(producto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg : error.message})
    }
    //Esta bien, se puede ELIMINAR
    producto.colaboradores.pull(req.body.id);
    await producto.save()
    res.json({ msg: "Colaborador Eliminado correctamente"})
    

}

//Clientes de un producto


export {
    obtenerProductos,
    nuevoProducto,
    obtenerProducto,
    editarProducto,
    eliminarProducto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador
}