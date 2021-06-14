import express, { Application } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import environment from './environment';
import https, { ServerOptions } from 'https';

class Server{
    private app: Application;

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

    configServer(): void{
        const { host, port } = environment;

        this.app.set('host', host || '127.0.0.1');
        this.app.set('port', port || 4000);
    }

    createHttpServer(): void{
        const httpServer = http.createServer(this.app);
        httpServer.listen(this.app.get('port'), this.app.get('host'), () => {
            console.log(`Server up and running http://${this.app.get('host')}:${this.app.get('port')}/`);
        })
    }

    createHttpsServer(): void{

        const { sslKey:key, sslCredentials:cred } = environment;
        
        const httpsServer = https.createServer({
            key,
            cred
        } as ServerOptions, this.app);

        httpsServer.listen(this.app.get('port'), this.app.get('host'), () => {
            console.log(`Server up and running http://${this.app.get('host')}:${this.app.get('port')}/`);
        })
    }

    initApp(): Application {
        return this.app;
    }
}

export default Server;