import  { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { addToCart, getCart, deleteFromCart, putCart} from './cart.controller.js';
import {validateFieldAddCart} from '../middlewares/validate-fieldname.js';

const router = Router();

router.post('/', [
    validateJWT,
    check('productId', 'productId is required').not().isEmpty(),
    
    check('quantity', 'quantity is required').not().isEmpty(),
    validateFieldAddCart,
    validateFields
], addToCart);

router.get('/', [
    validateJWT
], getCart);

router.delete('/', [
    validateJWT
], deleteFromCart);

router.put('/', [
    validateJWT
], putCart);

export default router;