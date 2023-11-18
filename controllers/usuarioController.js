import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const registrar = async (req, res) => {
    console.log("Desde la funcion 'registrar' en el archivo UsuarioController.js...");

    //Evitar registros Duplicados
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email});
    if(existeUsuario){
        const error = new Error("!Usuario ya registrado!");
        return res.status(400).json({msg : error.message});
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();

        //Enviar el email de confirmacion
        emailRegistro({
            email : usuario.email,
            nombre : usuario.nombre,
            token : usuario.token
        })
        res.json({ msg: "Usuario creado Correctamente, revisa tu Email para confirmar tu cuenta"});
    } catch (error) {
        console.log("Error en el trycatch de la funcion registrar: ", error);
    }  
};

const autenticar = async(req, res) => {
    console.log("Desde la funcion 'autenticar' en el archivo UsuarioController.js...");

    const {email, password} = req.body;

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    //Comprobar su password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id : usuario._id,
            nombre : usuario.nombre,
            email : usuario.email,
            token : generarJWT(usuario._id),
        })
    } else { 
        const error = new Error("El password es Incorrecto");
        return res.status(403).json({msg: error.message});
    }
}

const confirmar = async(req, res) =>{
    console.log("Desde la funcion 'confirmar' en el archivo UsuarioController.js...");
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});
    if(!usuarioConfirmar){
        const error = new Error("Token no valido");
        return res.status(403).json({msg: error.message});
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente"});
        console.log(usuarioConfirmar);
    } catch (error) {
        console.log("Error en la funcion confirmar...");
        console.log(error);
    }

}

const olvidePassword = async(req, res) => {
    console.log("Desde la funcion 'olvidePassword' en el archivo UsuarioController.js...");
    const { email } = req.body;
    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuario.token = generarId();
        await usuario.save();

        //Enviar el email para crear nuevo Password
        emailOlvidePassword({
            email : usuario.email,
            nombre : usuario.nombre,
            token : usuario.token
        })
        res.json({ msg: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async(req, res) => {
    console.log("Desde la funcion 'comprobarToken' en el archivo UsuarioController.js...");

    const {token} = req.params;

    const tokenValido = await Usuario.findOne({ token });

    if(tokenValido){
        res.json({ msg: "Token valido y el Usuario existe"})
    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }

}

const nuevoPassword = async(req, res) => {
    console.log("Desde la funcion 'nuevoPassword' en el archivo UsuarioController.js...");

    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if(usuario){
        usuario.password = password;
        usuario.token = '';
        try {
            await usuario.save();
            res.json({ msg: "Password Modificado Correctamente"});
        } catch (error) {
            console.log("Error en el trycatch de la funcion 'nuevoPassword'");
            console.log(error);
        }

    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }

    console.log(token);
    console.log(password);

}

const perfil = async (req, res) =>{
    console.log("Desde la funcion 'perfil' en el archivo UsuarioController.js...");
    const {usuario} = req;

    res.json(usuario)

}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}