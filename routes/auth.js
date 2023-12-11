const { Router }= require('express');
const { crearUsuario, loginUsuario, Renew } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


//Crear un nuevo usuario . 
router.post('/new' ,[
    check('name', 'El nombre es obligatorio').isAlphanumeric().notEmpty(),
    check('email', 'Email obligatorio').isEmail(),
    check('password', 'Password obligatoria').isLength({min:6 }),
    validarCampos
], crearUsuario);

//Login de usuario . 
router.post('/',[
    check('email', 'Email obligatorio').isEmail(),
    check('password', 'Password obligatoria').isLength({min:6 }),
    validarCampos
] ,loginUsuario);

//Validar y revalidar Token. 
router.get('/renew', validarJWT, Renew);

module.exports= router;