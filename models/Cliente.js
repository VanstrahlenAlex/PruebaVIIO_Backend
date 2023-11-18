import mongoose from "mongoose";

const clienteSchema = mongoose.Schema({
    nombre: {
        type : String,
        trim : true,
        required : true
    },
    descripcion : { 
        type : String,
        trim : true,
        required : true,
    },
    estado : {
        type : Boolean,
        default : false,
    },
    fechaEntrega : {
        type : Date,
        required: true,
        default : Date.now()
    },
    prioridad: {
        type : String,
        required: true,
        enum: ['Baja', 'Media', 'Alta'],
    },
    producto : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Producto"
    },
    completado : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Usuario"
    }
}, 
{
    timestamps : true
});

const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;