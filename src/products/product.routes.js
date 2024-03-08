import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import {
    postProduct, controlInventory, deleteProduct, getBestSellingProducts
    , getOutOfStockProducts, getProductById, getProducts, getProductsByCategory,
    searchProducts, updateProduct
} from './product.controller.js';
import { existsCategoryId } from '../helpers/db-validator.js';
import { getCategories } from '../category/category.controller.js';
import { validateFieldPostProduct } from '../middlewares/validate-fieldname.js';

const router = Router();

router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('category', 'Id is not a valid MONGODB format').isMongoId(),
    check('stock', 'Stock is required').not().isEmpty(),
    validateFieldPostProduct,
    validateFields
], postProduct);

router.get('/', [
    validateJWT,
    check('id', 'Id is not a valid MONGODB format').isMongoId()
], getProducts);

router.get('/:id', [
    validateJWT,
    check('id', 'Id is not a valid MONGODB format').isMongoId()
], getProductById);

export default router;