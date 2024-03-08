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
import { validateFieldProduct, validateFieldSearchProduct } from '../middlewares/validate-fieldname.js';

const router = Router();

router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('category', 'Id is not a valid MONGODB format').isMongoId(),
    check('stock', 'Stock is required').not().isEmpty(),
    validateFieldProduct,
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

router.put('/:id', [
    validateJWT,
    check('id', 'Id is not a valid MONGODB format').isMongoId(),
    check('category', 'Id is not a valid MONGODB format').isMongoId(),
    validateFieldProduct,
    validateFields
], updateProduct);

router.put('/control-inventory/:id', [
    validateJWT,
    check('id', 'Id is not a valid MONGODB format').isMongoId(),
    check('stock', 'Stock is required').not().isEmpty(),
    validateFields
], controlInventory);

router.get('/best/sellings', [
    validateJWT
], getBestSellingProducts);

router.get('/out/stock', [
    validateJWT
], getOutOfStockProducts);

router.delete('/:id', [
    validateJWT,
    check('id', 'Id is not a valid MONGODB format').isMongoId()
], deleteProduct);

router.post('/search', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFieldSearchProduct,
    validateFields
], searchProducts);

router.get('/get/category', [
    validateJWT,
    check('id', 'Id is not a valid MONGODB format').isMongoId()
], getCategories);

router.get('/get/category/:categoryId', [
    validateJWT,
    check('id', 'Id is not a valid MONGODB format').isMongoId()
], getProductsByCategory);

export default router;