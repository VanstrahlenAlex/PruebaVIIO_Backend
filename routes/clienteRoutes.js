import express from "express";
import {
    agregarCliente,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente,
    cambiarEstado
} from "../controllers/clienteController.js"
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/',checkAuth, agregarCliente);
router.route('/:id')
            .get(checkAuth, obtenerCliente)
            .put(checkAuth, actualizarCliente)
            .delete(checkAuth, eliminarCliente);

router.post('/estado/:id', checkAuth, cambiarEstado);

export default router;