const { Router, json, urlencoded } = require('express');
const AppController = require('../../controllers/app.controller.js');
const AppMiddleware = require('../middlewares/app.middleware.js');

class AppRouter {
    /**
     * Se contruye e inicializa el router del app
     */
    constructor() {
        /**
         * Creamos el router del app
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
    register(app) {
        app.use(this.router);
    }
}

export default new AppRouter();
