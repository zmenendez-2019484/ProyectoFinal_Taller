import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.conectarDB();
        this.registerUserPath = '/registrationManagement/v1/user';
        this.loginUserPath = '/registrationManagement/v1/user';
        this.editUserPath = '/registrationManagement/v1/user';
        this.deleteUserPath = '/registrationManagement/v1/user';
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
        this.app.use(this.registerUserPath, userRoutes);
        this.app.use(this.loginUserPath, userRoutes);
        this.app.use(this.editUserPath, userRoutes);
        this.app.use(this.deleteUserPath, userRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server is connected in the port", this.port)
        });
    }
}
export default Server;