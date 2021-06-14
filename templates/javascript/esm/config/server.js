import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import environment from './environment.js';

class Server{
    constructor(){
        dotenv.config();

        this.app = express();

        this.configServer();

        this.createHttpServer();
        /**
         * Descomentar esta linea para crear el servidor https
         * Colocar tus credenciales en el .env
         */
        // this.createHttpsServer();
    }

    configServer(){
        const { host, port } = environment;

        this.app.set('host', host || '127.0.0.1');
        this.app.set('port', port || 4000);
    }

    createHttpServer(){
        const httpServer = http.createServer(this.app);
        httpServer.listen(this.app.get('port'), this.app.get('host'), () => {
            console.log(`Server up and running http://${this.app.get('host')}:${this.app.get('port')}/`);
        })
    }

    createHttpsServer(){

        const { key, cred } = environment;
        
        const httpsServer = http.createServer(this.app,{
            key,
            cred
        });
        httpsServer.listen(this.app.get('port'), this.app.get('host'), () => {
            console.log(`Server up and running http://${this.app.get('host')}:${this.app.get('port')}/`);
        })
    }

    initApp() {
        return this.app;
    }
}

export default Server;
