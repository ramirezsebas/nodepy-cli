"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./config/server"));
const app_route_1 = __importDefault(require("./api/app/config/routes/app.route"));
(() => {
    const server = new server_1.default();
    const app = server.initApp();
    // Registramos los routers
    app_route_1.default.register(app);
})();
