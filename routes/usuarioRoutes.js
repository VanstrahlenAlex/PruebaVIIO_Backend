import express from "express";
const router = express.Router();

import {registrar,
        autenticar, 
        confirmar, 
        olvidePassword, 
        comprobarToken, 
        nuevoPassword,
        perfil} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

//Creacion, Registro y confirmacion de Usuarios
router.post('/', registrar); //Crea un nuevo usuario
router.post('/login', autenticar); //Autenticar usuario
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword); //Password Olvidado
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


//
router.get('/perfil', checkAuth, perfil);
export default router;