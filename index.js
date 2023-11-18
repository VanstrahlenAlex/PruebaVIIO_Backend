import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js"

const app = express();
app.use(express.json())

dotenv.config();

conectarDB();

//Configurar CORS - aqui debe ir la API que el explorador le asigne al proyecto.
const whitelist = [process.env.FRONTEND_URL];

const corsOption = {
    origin : function(origin, callback){
        if(whitelist.includes(origin)){
            //Puede consultar la API
            callback(null, true);
        } else {
            //No esta permitido 
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOption));


//Routing 
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/clientes", clienteRoutes);


const PORT = process.env.PORT || 4000;

console.log("Inicializando aplicacion Desde index.js");

app.listen(PORT, () =>{
    console.log(`Servidor para Prueba VIIO Corriendo en el puerto ${PORT}`);
});