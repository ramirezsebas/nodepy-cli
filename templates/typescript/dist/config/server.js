"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const environment_1 = __importDefault(require("./environment"));
const https_1 = __importDefault(require("https"));
class Server {
    constructor() {
        dotenv_1.default.config();
        this.app = express_1.default();
        this.configServer();
        this.createHttpServer();
        /**
         * Descomentar esta linea para crear el servidor https
         * Colocar tus credenciales en el .env
         */
        // this.createHttpsServer();
    }
    configServer() {
        const { host, port } = environment_1.default;
        this.app.set('host', host || '127.0.0.1');
        this.app.set('port', port || 4000);
    }
    createHttpServer() {
        const httpServer = http_1.default.createServer(this.app);
        httpServer.listen(this.app.get('port'), this.app.get('host'), () => {
            console.log(`Server up and running http://${this.app.get('host')}:${this.app.get('port')}/`);
        });
    }
    createHttpsServer() {
        const { sslKey: key, sslCredentials: cred } = environment_1.default;
        const httpsServer = https_1.default.createServer({
            key,
            cred
        }, this.app);
        httpsServer.listen(this.app.get('port'), this.app.get('host'), () => {
            console.log(`Server up and running http://${this.app.get('host')}:${this.app.get('port')}/`);
        });
    }
    initApp() {
        return this.app;
    }
}
exports.default = Server;
