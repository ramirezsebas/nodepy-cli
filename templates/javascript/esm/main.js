import Server from './config/server.js';
import AppRouter from './api/app/config/routes/app.route.js';

(() => {
    // Creamos el servidor
    const server = new Server();

    // Iniciamos la aplicación de express
    const app = server.initApp();

    // Registramos los routers
    AppRouter.register(app);
})();
