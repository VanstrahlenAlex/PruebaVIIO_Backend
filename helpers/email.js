import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
    const {nombre, email, token } = datos;

    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del email 

    const info = await transport.sendMail({
        from : '"Prueba VIIO - Administrador de Productos" <cuentas@pruebaviio.com>',
        to : email,
        subject : "Prueba VIIO - Comprueba tu cuenta",
        text : "Comprueba tu cuenta en Prueba VIIO",
        html : `
            <p> Hola ${nombre} Comprueba tu cuenta en Prueba VIIO </p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace </p>
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta </a>
            
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje </p>
        `
    })
}


export const emailOlvidePassword = async (datos) => {
    const {nombre, email, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del email 

    const info = await transport.sendMail({
        from : '"Prueba VIIO - Administrador de Productos" <cuentas@pruebaviio.com>',
        to : email,
        subject : "Prueba VIIO - Reestablece tu password",
        text : "Reestablece tu password",
        html : `
            <p> Hola ${nombre} Has solicitado reestablecer tu password</p>
            <p>Sigue en el siguiente enlace para generar un nuevo password</p>
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            
            <p>Si tu no solicitaste este cambio de clave, puedes ignorar este mensaje </p>
        `
    })
}