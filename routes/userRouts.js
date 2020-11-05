const { getUserController, signUpController, loginController, getUserControllerById } = require('../controller/userControllers');

const router=require('express').Router();
const { body } = require('express-validator');

router.get('/',getUserController)

router.get('/:uid',getUserControllerById)

router.post('/signUp',
    [
        body('name').not().isEmpty(),
        body('email').normalizeEmail().isEmail(),
        body('password').isLength({min:6})
    ],
    signUpController)

router.post('/login',
    [
        body('email').normalizeEmail().isEmail(),
        body('password').isLength({min:6})
    ],
    loginController)

module.exports=router