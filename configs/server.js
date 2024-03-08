import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';
import categoryRoutes from '../src/category/category.routes.js';
import productRoutes from '../src/products/product.routes.js';

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
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server is connected in the port", this.port)
        });
    }
}
export default Server;