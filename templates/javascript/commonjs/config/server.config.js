const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const https = require("https");

const environments = require("./environments.config.js");

class Server {
  constructor() {
    this.port = environments.port;
    this.app = express();
    this.generateMiddleware();
    this.generateRoutes();
  }

  generateMiddleware() {
    //Middleware For JSON Responses
    this.app.use(express.json({ extended: false }));

    //Middleware For Static Pages
    this.app.use("/", express.static(path.join(__dirname, "../public")));

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


module.exports = Server;
