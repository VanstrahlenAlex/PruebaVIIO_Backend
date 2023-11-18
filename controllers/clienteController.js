import Producto from "../models/Producto.js";
import Cliente from "../models/Cliente.js";

const agregarCliente = async(req, res) => {
    console.log("Desde la funcion 'agregarCliente' en el archivo clienteController.js...");
    const { producto } = req.body;

    const existeProducto = await Producto.findById(producto);

    console.log("linea 10-", existeProducto);
    if(!existeProducto){
        const error = new Error('El producto no existe');
        return res.status(404).json({ msg: error.message });
    }

    if(existeProducto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para añadir clientes');
        return res.status(403).json({ msg: error.message });
    }

    try {
        const clienteAlmacenado = await Cliente.create(req.body);
        //Almacenar el ID del Producto
        existeProducto.clientes.push(clienteAlmacenado._id);
        await existeProducto.save();
        res.json(clienteAlmacenado);
    } catch (error) {
        console.log("ERROR en el trycatch de la funcion 'agregarCliente' en el archivo clienteController.js... el error es el siguiente:");
        console.log(error);
    }
}

const obtenerCliente = async(req, res) => {
    console.log("Desde la funcion 'obtenerCliente' en el archivo clienteController.js...");

    //Condiciones de consulta para los clientes - Start
    const {id} = req.params;
    const cliente = await Cliente.findById(id).populate("producto")
    if(!cliente) {
        const error = new Error('El cliente no existe'); 
        return res.status(404).json({ msg: error.message });
    }
    if(cliente.producto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida'); 
        return res.status(403).json({ msg: error.message });
    }
    //Condiciones de consulta para los clientes - End

    res.json(cliente);

}

const actualizarCliente = async(req, res) => {
    console.log("Desde la funcion 'actualizarCliente' en el archivo clienteController.js...");

    const {id} = req.params;
    const cliente = await Cliente.findById(id).populate("producto")
    if(!cliente) {
        const error = new Error('El cliente no existe'); 
        return res.status(404).json({ msg: error.message });
    }
    if(cliente.producto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida'); 
        return res.status(403).json({ msg: error.message });
    }

    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.descripcion = req.body.descripcion || cliente.descripcion;
    cliente.prioridad = req.body.prioridad || cliente.prioridad;
    cliente.fechaEntrega = req.body.fechaEntrega || cliente.fechaEntrega;

    try {
        const clienteAlmacenado = await cliente.save();
        
        res.json(clienteAlmacenado);
    } catch (error) {
        console.log("ERROR en el trycatch de la funcion 'actualizarCliente' en el archivo clienteController.js... el error es el siguiente:");
        console.log(error);
    }

}

const eliminarCliente = async(req, res) => {
    //Condiciones de consulta para los clientes - Start
    const {id} = req.params;
    const cliente = await Cliente.findById(id).populate("producto")
    if(!cliente) {
        const error = new Error('El cliente no existe'); 
        return res.status(404).json({ msg: error.message });
    }
    if(cliente.producto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida'); 
        return res.status(403).json({ msg: error.message });
    }

    try {
        const producto = await Producto.findById(cliente.producto);
        producto.clientes.pull(cliente._id)
        await Promise.allSettled([await producto.save() ,await cliente.deleteOne()])
        res.json({ msg: "Cliente Eliminado correctamente"})
    } catch (error) {
        console.log("ERROR en el trycatch de la funcion 'eliminarCliente' en el archivo clienteController.js... el error es el siguiente:");
        console.log(error);
    }
}

const cambiarEstado = async(req, res) => {
    const {id} = req.params;
    const cliente = await Cliente.findById(id).populate("producto")

    console.log(cliente);
    if(!cliente) {
        const error = new Error('El cliente no existe'); 
        return res.status(404).json({ msg: error.message });
    }
    if(cliente.producto.creador.toString() !== req.usuario._id.toString() &&
    !cliente.producto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())
    ){
        const error = new Error('Acción no válida'); 
        return res.status(403).json({ msg: error.message });
    }

    cliente.estado = !cliente.estado;
    cliente.completado = req.usuario._id
    await cliente.save();

    const clienteAlmacenado = await Cliente.findById(id).populate("producto")
    res.json(clienteAlmacenado);
}

export { 
    agregarCliente,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente,
    cambiarEstado
}