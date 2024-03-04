import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { register, login, editUser, deleteUser} from './user.controller.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateFieldRegister, validateFieldLogin, validateFieldEdit } from '../middlewares/validate-fieldname.js';
import { existsEmail, existsUsername } from '../helpers/db-validator.js';
const router = Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('age', 'Age is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('username').custom(existsUsername),
    check('email', 'Email is required').isEmail(),
    check('email', 'El correo no es un correo valido').isEmail(),
    check('email').custom(existsEmail),
    check('password', 'Password is required').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validateFieldRegister,
    validateFields
], register);

router.post('/login', [
    check('password', 'Password is required').not().isEmpty(),
    validateFieldLogin,
    validateFields
], login);

router.put('/edit', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('age', 'Age is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('email', 'El correo no es un correo valido').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFieldEdit,
    validateFields
], editUser);

router.delete('/delete', [
    validateJWT,
    validateFields
], deleteUser);

export default router;