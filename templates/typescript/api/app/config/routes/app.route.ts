import { Router, json, urlencoded, Application } from 'express';
import AppController from '../../controllers/app.controller';
import AppMiddleware from '../middlewares/app.middleware';

class AppRouter {
    private router: Router;
    /**
     * Se contruye e inicializa el router del recurso
     */
    constructor() {
        /**
         * Creamos el router del recurso
         */
        this.router = Router();

        /**
         * Agregamos algunos middlewares al router
         */
        this.router
         .use(json())
         .use(urlencoded({extended: false}))

        /**
         * Registramos todas las rutas en el router con sus respectivos controllers
         */
        this.router
            .route('/app')
            .get(AppMiddleware.logger, AppController.findAll)
            .post(AppMiddleware.logger, AppController.create);
    }

    /**
     * Permite registrar el router en una aplicación
     * @param {*} app: La aplicación en la cual se registrará el router 
     */
    register(app: Application): void {
        app.use(this.router);
    }
}

export default new AppRouter();
