import { Application } from 'express'; 
import Server from './config/server';
import AppRouter from './api/app/config/routes/app.route';

(() => {
    const server: Server = new Server();
    const app: Application = server.initApp();

    // Registramos los routers
    AppRouter.register(app);
})();
