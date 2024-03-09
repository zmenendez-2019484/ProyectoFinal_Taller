import {Router} from 'express';
import {getPurchaseHistory, completePurchase} from './purchase.controller.js';
import {validateJWT} from '../middlewares/validate-jwt.js';

const router = Router();

router.get('/history',[
    validateJWT
], getPurchaseHistory);

router.post('/complete',[
    validateJWT
], completePurchase);

export default router;