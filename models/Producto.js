import mongoose from "mongoose";

const productosSchema = mongoose.Schema({
    nombre : {
        type : String,
        trim : true,
        required : true
    },
    descripcion : {
        type : String,
        trim : true,
        required : true
    },
    fechaEntrega : {
        type : Date,
        default : Date.now(),
    },
    marca : {
        type : String,
        trim : true,
        required : true
    },
    creador: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Usuario",
    },
    clientes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Cliente",
            
        }
    ],
    colaboradores: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Usuario",
        },
    ],
},
    {
        timestamps: true,
    }
);

const Producto = mongoose.model("Producto", productosSchema);
export default Producto;