const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.databaseconnection();
    this.middleware();
    this.routes();
  }

  databaseconnection() {}

  middleware() {
    //Permitir los requests y responses en formato JSON
    this.app.use(express.json({ extended: false }));

    //Permitir que se consuma paginas Estaticas
    this.app.use("/", express.static(path.join(__dirname, "../public")));

    //Permitir el CORS(DEFINIR LOS QUE TIENEN ACCESO)
    this.app.use(cors());
  }

  routes() {
    //Ruta de Prueba
    this.app.get("/prueba", (req, res) => {
      return res.status(200).json({
        mensaje: "Funciona Correctamente",
      });
    });

    //En caso que la ruta no exista
    this.app.use("*", (request, response) =>
      response.status(404).json({
        ok: false,
        mensaje: "No existe la Ruta",
        respuesta: null,
      })
    );
  }

  createHttpServer() {
    let httpServer = http.createServer(this.app);
    httpServer.listen(8000, () => {
      console.log(`Corriendo http://localhost:${8000}`);
    });
  }

  createHttpsServer() {
    //Agregar Clave de Seguridad para https
    let privateKey = fs.readFileSync(process.env.RUTA_CLAVE);
    let certificate = fs.readFileSync(process.env.RUTA_CREEDENCIAL);

    let creedenciales = { key: privateKey, cert: certificate };
    let httpsServer = https.createServer(creedenciales, this.app);
    httpsServer.listen(this.portHttps, () => {
      console.log(`Corriendo en host:${this.portHttps}`);
    });
  }
}

const server = new Server();

Object.freeze(server);

module.exports = server;
