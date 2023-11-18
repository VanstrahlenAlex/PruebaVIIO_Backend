import express from "express";
import {
    obtenerProductos,
    nuevoProducto,
    obtenerProducto,
    editarProducto,
    eliminarProducto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    } from "../controllers/productoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/')
            .get(checkAuth, obtenerProductos)
            .post(checkAuth, nuevoProducto);

router.route('/:id')
            .get(checkAuth, obtenerProducto)
            .put(checkAuth, editarProducto)
            .delete(checkAuth, eliminarProducto);

router.post('/colaboradores/', checkAuth, buscarColaborador);
router.post('/colaboradores/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador);

export default router;
