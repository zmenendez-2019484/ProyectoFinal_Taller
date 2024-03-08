import e, { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { addToCart, getCart, removeFromCart, putCart} from './cart.controller.js';
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

router.delete('/:id', [
    validateJWT,
    check('id', 'id is required').not().isEmpty()
], removeFromCart);

router.put('/:id', [
    validateJWT,
    check('id', 'id is required').not().isEmpty()
], putCart);

export default router;