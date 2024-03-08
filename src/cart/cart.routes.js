import e, { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { addToCart, getCart, removeFromCart } from './cart.controller.js';
import { existsProductId } from '../helpers/db-validator.js';
import {validateFieldAddCart} from '../middlewares/validate-fieldname.js';

const router = Router();

router.post('/', [
    validateJWT,
    check('productId', 'productId is required').not().isEmpty(),
    existsProductId,
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

export default router;