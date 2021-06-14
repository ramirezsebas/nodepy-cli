"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_controller_1 = __importDefault(require("../../controllers/app.controller"));
const app_middleware_1 = __importDefault(require("../middlewares/app.middleware"));
class AppRouter {
    /**
     * Se contruye e inicializa el router del recurso
     */
    constructor() {
        /**
         * Creamos el router del recurso
         */
        this.router = express_1.Router();
        /**
         * Agregamos algunos middlewares al router
         */
        this.router
            .use(express_1.json())
            .use(express_1.urlencoded({ extended: false }));
        /**
         * Registramos todas las rutas en el router con sus respectivos controllers
         */
        this.router
            .route('/app')
            .get(app_middleware_1.default.logger, app_controller_1.default.findAll)
            .post(app_middleware_1.default.logger, app_controller_1.default.create);
    }
    /**
     * Permite registrar el router en una aplicación
     * @param {*} app: La aplicación en la cual se registrará el router
     */
    register(app) {
        app.use(this.router);
    }
}
exports.default = new AppRouter();
