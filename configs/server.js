import express from 'express';
import cors  from'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.conectarDB();
    }

    async conectarDB(){
        await dbConnection();
    }
    middlewares(){
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan('dev'));
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log("Server is connected in the port", this.port)
        });
    }
}
export default Server;