import  { Router } from 'express';
import {validateFieldEditInvoice} from '../middlewares/validate-fieldname.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { getUserPurchaseHistory, editInvoice, getInvoiceDetails, getUserInvoices } from './invoice.controller.js';

const router = Router();

router.get('/', [
    validateJWT
], getUserPurchaseHistory);

router.get('/:userId', [
    validateJWT
], getUserInvoices);

router.get('/details/:invoiceId', [
    validateJWT
], getInvoiceDetails);

router.put('/', [
    validateJWT,
    validateFieldEditInvoice
], editInvoice);


export default router;