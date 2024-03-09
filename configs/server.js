import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';
import categoryRoutes from '../src/category/category.routes.js';
import productRoutes from '../src/products/product.routes.js';
import cartRoutes from '../src/cart/cart.routes.js';
import purchaseRoutes from '../src/purchase/purchase.routes.js';
import historyRoutes from '../src/invoice/invoice.routes.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.conectarDB();
        //user
        this.registerUserPath = '/registrationManagement/v1/user';
        this.loginUserPath = '/registrationManagement/v1/user';
        this.editUserPath = '/registrationManagement/v1/user';
        this.changeRoleUserPath = '/registrationManagement/v1/user';
        this.deleteUserPath = '/registrationManagement/v1/user';
        //category
        this.postCategoryPath = '/registrationManagement/v1/category';
        this.getCategoriesPath = '/registrationManagement/v1/category';
        this.getByIdCategoryPath = '/registrationManagement/v1/category';
        this.editCategoryPath = '/registrationManagement/v1/category';
        this.deleteCategoryPath = '/registrationManagement/v1/category';
        //product
        this.postProductPath = '/registrationManagement/v1/product';
        this.getProductsPath = '/registrationManagement/v1/product';
        this.getByIdProductPath = '/registrationManagement/v1/product';
        this.editProductPath = '/registrationManagement/v1/product';
        this.controlStockProductPath = '/registrationManagement/v1/product';
        this.getOutOfStockProductPath = '/registrationManagement/v1/product';
        this.getBestSellingProductPath = '/registrationManagement/v1/product';
        this.deleteProductPath = '/registrationManagement/v1/product';
        this.searchProductPath = '/registrationManagement/v1/product';
        this.getProductosByCategoryPath = '/registrationManagement/v1/product';
        //cart
        this.addToCartPath = '/registrationManagement/v1/cart';
        this.getCartPath = '/registrationManagement/v1/cart';
        this.removeFromCartPath = '/registrationManagement/v1/cart';
        this.putCartPath = '/registrationManagement/v1/cart';
        //purchase
        this.getPurchaseHistoryPath = '/registrationManagement/v1/purchase';
        this.completePurchasePath = '/registrationManagement/v1/purchase';
        //history of purchase
        this.getPurchaseHistoryPath = '/registrationManagement/v1/history';
        //invoice
        this.getInvoicePath = '/registrationManagement/v1/invoice';
        this.getInvoiceDetailsPath = '/registrationManagement/v1/invoice';
        this.editInvoicePath = '/registrationManagement/v1/invoice';

        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }
    
    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan('dev'));
    }

    routes() {
        //user
        this.app.use(this.registerUserPath, userRoutes);
        this.app.use(this.loginUserPath, userRoutes);
        this.app.use(this.editUserPath, userRoutes);
        this.app.use(this.changeRoleUserPath, userRoutes);
        this.app.use(this.deleteUserPath, userRoutes);
        //category
        this.app.use(this.postCategoryPath, categoryRoutes);
        this.app.use(this.getCategoriesPath, categoryRoutes);
        this.app.use(this.getByIdCategoryPath, categoryRoutes);
        this.app.use(this.editCategoryPath, categoryRoutes);
        this.app.use(this.deleteCategoryPath, categoryRoutes);
        //product
        this.app.use(this.postProductPath, productRoutes);
        this.app.use(this.getProductsPath, productRoutes);
        this.app.use(this.getByIdProductPath, productRoutes);
        this.app.use(this.editProductPath, productRoutes);
        this.app.use(this.controlStockProductPath, productRoutes);
        this.app.use(this.getOutOfStockProductPath, productRoutes);
        this.app.use(this.getBestSellingProductPath, productRoutes);
        this.app.use(this.deleteProductPath, productRoutes);
        this.app.use(this.searchProductPath, productRoutes);
        this.app.use(this.getProductosByCategoryPath, productRoutes);
        //cart
        this.app.use(this.addToCartPath, cartRoutes);
        this.app.use(this.getCartPath, cartRoutes);
        this.app.use(this.removeFromCartPath, cartRoutes);
        this.app.use(this.putCartPath, cartRoutes);
        //purchase
        this.app.use(this.getPurchaseHistoryPath, purchaseRoutes);
        this.app.use(this.completePurchasePath, purchaseRoutes);
        //history of purchase
        this.app.use(this.getPurchaseHistoryPath, historyRoutes);
        //invoice
        this.app.use(this.getInvoicePath, historyRoutes);
        this.app.use(this.getInvoiceDetailsPath, historyRoutes);
        this.app.use(this.editInvoicePath, historyRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server is connected in the port", this.port)
        });
    }
}
export default Server;