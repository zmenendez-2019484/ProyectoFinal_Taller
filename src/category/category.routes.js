import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateFieldPostCategory } from '../middlewares/validate-fieldname.js';
import { postCategory, getCategories, getCategoryById, updateCategory } from './category.controller.js';
import { existsCategoryId } from '../helpers/db-validator.js';

const router = Router();

router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields,
    validateFieldPostCategory
], postCategory);

router.get('/', getCategories);

router.get('/:id', [
    validateJWT,
    check('id', 'Id is required').not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existsCategoryId)
], getCategoryById);

router.put('/:id', [
    validateJWT,
    check('id', 'Id is required').not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existsCategoryId),
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields
], updateCategory);

export default router;