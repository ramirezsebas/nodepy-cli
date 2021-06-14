"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppMiddleware {
    logger(req, res, next) {
        console.log(`Atendiendo un ${req.method} request...`);
        next();
    }
}
exports.default = new AppMiddleware();
