const { response} = require('express');
const Usuario = require('../models/Usuario'); 
const bcrypt = require('bcryptjs');
const { generaJWT } = require('../controllers/helpers/jwt')
// si falla el JWT revisar la carpeta de helpers , dentro de controllers . 


const crearUsuario = async(req , res = response) => {

    const { email, name, password} = req.body;

try {
//verificar si existe email ya registrado

let usuario = await Usuario.findOne({email});
 
if (usuario){
    return res.status(400).json({
        ok:false,
        msg: 'Ya hay un usuario resgistrado con este email'
    });
}
//Crear usuario con modelo 
const dbUser = new Usuario(req.body);

//Hashear contraseña
const salt = bcrypt.genSaltSync(10);
dbUser.password = bcrypt.hashSync(password, salt); 

//Generar JsonWebToken
const token  = await generaJWT(dbUser.id , name);

//Crear usuario de Base de Datos 
await dbUser.save();

//Generar respuesta con exito
return res.status(201).json({
    ok: true,
    uid: dbUser.id,
    name,
    token 
}); 
    
} catch (error) {
    return res.status(500).json({
        ok: false,
        msg: 'Error , hable con el administrador'
    }); 
}
   
}
 const loginUsuario = async(req , res = response ) => {
    const { email, password} = req.body;
    
    try {
        const dbUser = await Usuario.findOne({email});
            if(!dbUser){
                return res.status(400).json({
                    ok:false, 
                    msg: 'El email no es correcto o no existe'
                });
            }      
    //confirmar si el password hace match 
            
    const validPassword = bcrypt.compareSync(password, dbUser.password);
            if(!validPassword){
                return res.status(400).json({
                    ok:false, 
                    msg: 'La contraseña no es correcta'
                });
            }
            //Generamos JWT
            const token  = await generaJWT(dbUser.id , dbUser.name);
            //Respuesta
            return res.json({
                ok:true,
                uid: dbUser.id,
                name: dbUser.name,
                token
            });
     
        } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok:false, 
            msg: 'Hable con el administrador por fallo en Login'
        })
    }
}
const Renew = (req , res = response) => {

    return res.json({
        ok: true,
        msg: 'Renew'
    });
}
 
module.exports = {
    crearUsuario,
    loginUsuario,
    Renew
}