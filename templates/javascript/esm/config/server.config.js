import express from 'express';
import path from "path";
import http from 'http';
import https from "https";

import { Environments } from './environment.config.js';

class Server{
    constructor() {
        this.port = Environments.port;
        this.app = express();
        this.generateMiddleware();
        this.generateRoutes();
      }
    
      generateMiddleware() {
        //Middleware For JSON Responses
        this.app.use(express.json({ extended: false }));
    
        //Middleware For Static Pages
        this.app.use("/", express.static(path.join(new URL(import.meta.url).pathname, "../public")));
    
        //Middleware For Cors
        this.app.use(cors());
      }
    
      generateRoutes() {
        //Test Route
        this.app.get("/test", (req, res) => {
          return res.status(200).json({
            mensaje: "API Working Fine",
          });
        });
      }
    
      createHttpServer() {
        let httpServer = http.createServer(this.app);
        httpServer.listen(this.port, () => {
          console.log(`Server running on http://localhost:${this.port}`);
        });
      }
    
      createHttpsServer() {
        let privateKey = fs.readFileSync(process.env.RUTA_CLAVE);
        let certificate = fs.readFileSync(process.env.RUTA_CREEDENCIAL);
    
        let creedenciales = { key: privateKey, cert: certificate };
        let httpsServer = https.createServer(creedenciales, this.app);
        httpsServer.listen(this.portHttps, () => {
          console.log(`Server Running on host:${this.portHttps}`);
        });
      }
}

export default Server;
