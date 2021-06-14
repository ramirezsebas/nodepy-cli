const Server = require('./config/server.js');
const AppRouter = require('./api/app/config/routes/app.route.js');

(() => {
    // Creamos el servidor
    const server = new Server();

    // Iniciamos la aplicación de express
    const app = server.initApp();

    // Registramos los routers
    AppRouter.register(app);
})();
